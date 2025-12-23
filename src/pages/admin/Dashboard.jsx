import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { statsApi } from '../../lib/supabase';
import {
    LayoutDashboard,
    FolderOpen,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    X,
    Plus,
    Users,
    Eye,
    TrendingUp,
    Loader
} from 'lucide-react';
import ProjectsManager from './ProjectsManager';
import MessagesManager from './MessagesManager';
import './Dashboard.css';

const DashboardHome = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await statsApi.getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error('Error cargando estadísticas:', error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    const statCards = [
        {
            icon: FolderOpen,
            label: 'Proyectos',
            value: stats?.projects || 0,
            color: 'primary',
            trend: 'Total registrados'
        },
        {
            icon: MessageSquare,
            label: 'Mensajes',
            value: stats?.messages || 0,
            color: 'secondary',
            trend: `${stats?.unreadMessages || 0} sin leer`
        },
        {
            icon: Eye,
            label: 'Visitas',
            value: '--',
            color: 'accent',
            trend: 'Próximamente'
        },
        {
            icon: Users,
            label: 'Clientes',
            value: '--',
            color: 'primary',
            trend: 'Próximamente'
        }
    ];

    return (
        <div className="dashboard-home">
            <div className="dashboard-welcome">
                <h1>¡Bienvenido al Panel!</h1>
                <p>Administra tu sitio web desde aquí.</p>
            </div>

            <div className="dashboard-stats">
                {loading ? (
                    <div className="stats-loading">
                        <Loader className="spinner" size={24} />
                        <span>Cargando estadísticas...</span>
                    </div>
                ) : (
                    statCards.map((stat, index) => (
                        <div key={index} className={`stat-card stat-${stat.color}`}>
                            <div className="stat-icon">
                                <stat.icon size={24} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-value">{stat.value}</span>
                                <span className="stat-label">{stat.label}</span>
                                <span className="stat-trend">
                                    <TrendingUp size={14} />
                                    {stat.trend}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="dashboard-quick-actions">
                <h2>Acciones rápidas</h2>
                <div className="quick-actions-grid">
                    <Link to="/admin/projects" className="quick-action">
                        <Plus size={24} />
                        <span>Agregar proyecto</span>
                    </Link>
                    <Link to="/admin/messages" className="quick-action">
                        <MessageSquare size={24} />
                        <span>Ver mensajes</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/admin/login');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/projects', icon: FolderOpen, label: 'Proyectos' },
        { path: '/admin/messages', icon: MessageSquare, label: 'Mensajes' },
        { path: '/admin/settings', icon: Settings, label: 'Configuración' }
    ];

    return (
        <div className={`dashboard-layout ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <Link to="/" className="sidebar-logo">
                        <svg viewBox="0 0 50 50" className="logo-icon">
                            <circle cx="25" cy="25" r="20" fill="none" stroke="url(#gradDash1)" strokeWidth="3" />
                            <circle cx="25" cy="25" r="14" fill="none" stroke="url(#gradDash2)" strokeWidth="2" />
                            <text x="25" y="31" textAnchor="middle" fill="#00A651" fontSize="16" fontWeight="bold">G</text>
                            <defs>
                                <linearGradient id="gradDash1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#00AEEF" />
                                    <stop offset="50%" stopColor="#00A651" />
                                    <stop offset="100%" stopColor="#EC008C" />
                                </linearGradient>
                                <linearGradient id="gradDash2" x1="100%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#EC008C" />
                                    <stop offset="100%" stopColor="#00AEEF" />
                                </linearGradient>
                            </defs>
                        </svg>
                        {sidebarOpen && <span className="logo-text">INGCOR</span>}
                    </Link>
                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <item.icon size={20} />
                            {sidebarOpen && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">
                            {user?.email?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        {sidebarOpen && (
                            <div className="user-details">
                                <span className="user-name">Administrador</span>
                                <span className="user-email">{user?.email || 'admin@grupoingcor.com'}</span>
                            </div>
                        )}
                    </div>
                    <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
                        <LogOut size={20} />
                        {sidebarOpen && <span>Salir</span>}
                    </button>
                </div>
            </aside>

            <main className="dashboard-main">
                <Routes>
                    <Route path="dashboard" element={<DashboardHome />} />
                    <Route path="projects" element={<ProjectsManager />} />
                    <Route path="messages" element={<MessagesManager />} />
                    <Route path="settings" element={<div className="coming-soon"><h2>Configuración</h2><p>Próximamente...</p></div>} />
                    <Route path="*" element={<DashboardHome />} />
                </Routes>
            </main>
        </div>
    );
};

export default Dashboard;
