// entry-server.jsx
import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import AppRoutes from './app';

export async function render(url) {
  let didError = false;
  const stream = renderToPipeableStream(
    <StaticRouter location={url} basename="/admin-spa">
      <AppRoutes />
    </StaticRouter>,
    {
      onShellReady() {
        res.status(didError ? 500 : 200);
        stream.pipe(res);
      },
      onError(error) {
        didError = true;
        console.error(error);
      }
    }
  );
}