import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Página principal pública */}
          <Route path="/" element={<Home />} />

          {/* Portal de administración */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
