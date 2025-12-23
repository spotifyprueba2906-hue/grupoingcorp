import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Si ya está autenticado, redirigir al dashboard
    if (isAuthenticated) {
        navigate('/admin/dashboard');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Por favor completa todos los campos');
            setLoading(false);
            return;
        }

        try {
            await signIn(email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Error de login:', err);
            setError('Credenciales incorrectas. Por favor verifica tu email y contraseña.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-background">
                <div className="login-gradient"></div>
            </div>

            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <svg viewBox="0 0 50 50" className="login-logo">
                            <circle cx="25" cy="25" r="20" fill="none" stroke="url(#gradLogin1)" strokeWidth="3" />
                            <circle cx="25" cy="25" r="14" fill="none" stroke="url(#gradLogin2)" strokeWidth="2" />
                            <text x="25" y="31" textAnchor="middle" fill="#00A651" fontSize="16" fontWeight="bold">G</text>
                            <defs>
                                <linearGradient id="gradLogin1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#00AEEF" />
                                    <stop offset="50%" stopColor="#00A651" />
                                    <stop offset="100%" stopColor="#EC008C" />
                                </linearGradient>
                                <linearGradient id="gradLogin2" x1="100%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#EC008C" />
                                    <stop offset="100%" stopColor="#00AEEF" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <h1>Panel de Administración</h1>
                        <p>Grupo Ingcor</p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        {error && (
                            <div className="login-error">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label" htmlFor="email">
                                Correo electrónico
                            </label>
                            <div className="input-wrapper">
                                <Mail size={18} className="input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    className="form-input with-icon"
                                    placeholder="admin@grupoingcor.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">
                                Contraseña
                            </label>
                            <div className="input-wrapper">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    className="form-input with-icon"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg btn-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="spinner-icon" />
                                    <span>Iniciando sesión...</span>
                                </>
                            ) : (
                                <span>Iniciar sesión</span>
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <a href="/">← Volver al sitio principal</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
