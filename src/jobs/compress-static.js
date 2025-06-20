import fs from 'fs/promises';
import path from 'path';
import zlib from 'zlib';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { createReadStream, createWriteStream } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const timer = { start: 0, end: 0, get duration() { return (this.end - this.start) / 1000; } };
const LOG_FILE = path.resolve(__dirname, '../../logs/compress.log');

async function logToFile(message) {
  const timestamp = new Date().toISOString();
  await fs.appendFile(LOG_FILE, `[${timestamp}] ${message}\n`).catch(err => {
    console.error('Ошибка записи лога:', err.message);
  });
}

async function getAllFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async entry => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? await getAllFiles(fullPath) : fullPath;
  }));
  return files.flat();
}

async function compressFile(filePath, slotIndex) {
  const gzPath = `${filePath}.gz`;
  try {
    const [originalStats, gzExists] = await Promise.all([
      fs.stat(filePath),
      fs.access(gzPath).then(() => true).catch(() => false),
    ]);

    if (gzExists) {
      const gzStats = await fs.stat(gzPath);
      if (gzStats.mtimeMs >= originalStats.mtimeMs) {
        await logToFile(`↷ Пропущен (актуален): ${gzPath}`);
        return { success: false, filePath, reason: 'fresh_archive' };
      }
    }

    await new Promise((resolve, reject) => {
      const readStream = createReadStream(filePath);
      const writeStream = createWriteStream(gzPath);
      const gzip = zlib.createGzip();

      readStream.pipe(gzip).pipe(writeStream)
        .on('finish', resolve)
        .on('error', reject);
    });

    await logToFile(`✔ Сжат: ${filePath}`);
    return { success: true, filePath };
  } catch (err) {
    await logToFile(`✘ Ошибка: ${filePath} — ${err.message}`);
    return { success: false, filePath, reason: 'error', error: err.message };
  }
}

async function runParallelCompression(tasks, maxFiles) {
  const results = [];
  const executing = new Set();
  const slotStats = Array.from({ length: maxFiles }, () => 0);
  let currentSlotIndex = 0;

  for (const task of tasks) {
    const slotIndex = currentSlotIndex;
    const promise = compressFile(task, slotIndex).then(result => {
      executing.delete(promise);
      if (result.success) slotStats[slotIndex]++;
      return { ...result, slotIndex };
    });
    executing.add(promise);
    results.push(promise);
    currentSlotIndex = (currentSlotIndex + 1) % maxFiles;
    if (executing.size >= maxFiles) await Promise.race(executing);
  }

  const finalResults = await Promise.all(results);
  finalResults.slotStats = slotStats;
  return finalResults;
}

function askConfirmation(question) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function compressDir(dirPath, maxFiles) {
  await logToFile(`📂 Начало сжатия: ${dirPath}`);
  const allFiles = await getAllFiles(dirPath);
  const candidates = allFiles.filter(f => !f.endsWith('.gz'));

  const toCompress = [];
  const freshArchives = [];

  for (const file of candidates) {
    const gzPath = `${file}.gz`;
    try {
      const [srcStats, gzStats] = await Promise.all([fs.stat(file), fs.stat(gzPath)]);
      if (gzStats.mtimeMs < srcStats.mtimeMs) toCompress.push(file);
      else freshArchives.push(file);
    } catch {
      toCompress.push(file);
    }
  }

  if (toCompress.length === 0) {
    await logToFile(`✅ Нет файлов для сжатия в ${dirPath}`);
    return;
  }

  const answer = await askConfirmation(`Сжать ${toCompress.length} файлов из ${dirPath}? (y/n): `);
  if (answer !== 'y') return;

  timer.start = Date.now();
  const results = await runParallelCompression(toCompress, maxFiles);
  timer.end = Date.now();

  const compressedFiles = results.filter(r => r.success).length;
  const failedFiles = results.filter(r => !r.success && r.reason === 'error').length;
  const slotStats = results.slotStats;

  const rows = [
    `▸ Всего файлов: ${allFiles.length}`,
    `▸ Кандидатов: ${toCompress.length}`,
    `▸ Сжато: ${compressedFiles}`,
    `▸ Пропущено: ${freshArchives.length}`,
    `▸ Ошибок: ${failedFiles}`,
    `▸ Слотов: ${maxFiles}`,
    `▸ Время: ${timer.duration.toFixed(2)}s`,
    `▸ Скорость: ${(compressedFiles / timer.duration).toFixed(1)} файл/сек`,
    ...slotStats.map((count, i) => `   └ Слот #${i + 1}: ${count}`)
  ];

  const statsString = rows.join('\n');
  console.log(`\n${statsString}\n`);
  await logToFile(`📊 Статистика:\n${statsString}`);
  await logToFile(`✅ Завершено: ${dirPath}\n`);
}

const inputDirs = [
  path.resolve(__dirname, '../../admin-spa/dist'),
  path.resolve(__dirname, '../../client-spa/dist')
];

const maxFilesArg = parseInt(process.argv[2], 10) || 4;

(async () => {
  for (const dir of inputDirs) {
    try {
      await compressDir(dir, maxFilesArg);
    } catch (err) {
      await logToFile(`✘ Ошибка при сжатии директории ${dir}: ${err.message}`);
    }
  }
})();