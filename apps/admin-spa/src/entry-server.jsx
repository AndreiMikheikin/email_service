import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import AppRoutes from './app';

export function render(url, opts) {
  return renderToPipeableStream(
    <StaticRouter location={url} basename="/admin-spa">
      <AppRoutes />
    </StaticRouter>,
    opts
  );
}