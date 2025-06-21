// entry-server.jsx
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import AppRoutes from './app';

export function render(url) {
  return renderToString(
    <StaticRouter location={url} basename="/admin-spa">
      <AppRoutes />
    </StaticRouter>
  );
}
