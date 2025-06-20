// apps/admin-spa/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'
import Register from './components/Register';
import EmailConfirm from './components/EmailConfirm';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import AdminDashboard from './components/AdminDashboard';

const App = () => (
  <Router basename="/admin-spa">
    <Routes>
      <Route path ="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/confirm-email" element={<EmailConfirm />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/adminDashboard" element={<AdminDashboard />} />
    </Routes>
  </Router>
);

export default App;