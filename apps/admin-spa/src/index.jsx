// index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './app';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/admin-spa">
    <AppRoutes />
  </BrowserRouter>
);