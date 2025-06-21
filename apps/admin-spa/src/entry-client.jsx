import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './app';

ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <BrowserRouter basename="/admin-spa">
    <AppRoutes />
  </BrowserRouter>
);