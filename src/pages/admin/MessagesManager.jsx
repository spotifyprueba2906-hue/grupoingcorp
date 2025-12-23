import { useState, useEffect } from 'react';
import {
    Search,
    Mail,
    Trash2,
    Check,
    Eye,
    X,
    Phone,
    Calendar
} from 'lucide-react';
import { messagesApi } from '../../lib/supabase';
import './Manager.css';

const MessagesManager = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [filter, setFilter] = useState('all'); // all, unread, read

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            const data = await messagesApi.getAll();
            setMessages(data || []);
        } catch (error) {
            console.error('Error cargando mensajes:', error);
            // Mensajes demo
            setMessages([
                {
                    id: 1,
                    name: 'Juan Pérez',
                    email: 'juan@ejemplo.com',
                    phone: '+52 55 1234 5678',
                    message: 'Hola, me gustaría solicitar una cotización para mantenimiento de mi edificio.',
                    read: false,
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'María García',
                    email: 'maria@ejemplo.com',
                    phone: null,
                    message: 'Necesito información sobre sus servicios de plomería.',
                    read: true,
                    created_at: new Date(Date.now() - 86400000).toISOString()
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await messagesApi.markAsRead(id);
            setMessages(prev => prev.map(m =>
                m.id === id ? { ...m, read: true } : m
            ));
        } catch (error) {
            console.error('Error marcando como leído:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este mensaje?')) return;

        try {
            await messagesApi.delete(id);
            setMessages(prev => prev.filter(m => m.id !== id));
            if (selectedMessage?.id === id) {
                setSelectedMessage(null);
            }
        } catch (error) {
            console.error('Error eliminando mensaje:', error);
            alert('Error al eliminar el mensaje.');
        }
    };

    const openMessage = (message) => {
        setSelectedMessage(message);
        if (!message.read) {
            handleMarkAsRead(message.id);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredMessages = messages.filter(m => {
        const matchesSearch =
            m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.message?.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'unread') return matchesSearch && !m.read;
        if (filter === 'read') return matchesSearch && m.read;
        return matchesSearch;
    });

    const unreadCount = messages.filter(m => !m.read).length;

    return (
        <div className="manager-page messages-page">
            <div className="manager-header">
                <div>
                    <h1>Mensajes de Contacto</h1>
                    <p>Gestiona los mensajes recibidos del formulario de contacto</p>
                </div>
                {unreadCount > 0 && (
                    <span className="unread-badge">{unreadCount} sin leer</span>
                )}
            </div>

            <div className="manager-toolbar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Buscar mensajes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        Todos
                    </button>
                    <button
                        className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
                        onClick={() => setFilter('unread')}
                    >
                        Sin leer
                    </button>
                    <button
                        className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
                        onClick={() => setFilter('read')}
                    >
                        Leídos
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="manager-loading">
                    <div className="spinner"></div>
                    <p>Cargando mensajes...</p>
                </div>
            ) : (
                <div className="messages-layout">
                    <div className="messages-list">
                        {filteredMessages.length === 0 ? (
                            <div className="empty-state">
                                <Mail size={48} />
                                <p>No hay mensajes</p>
                            </div>
                        ) : (
                            filteredMessages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`message-item ${!message.read ? 'unread' : ''} ${selectedMessage?.id === message.id ? 'selected' : ''}`}
                                    onClick={() => openMessage(message)}
                                >
                                    <div className="message-status">
                                        {!message.read && <span className="unread-dot"></span>}
                                    </div>
                                    <div className="message-content">
                                        <div className="message-header">
                                            <span className="message-name">{message.name}</span>
                                            <span className="message-date">{formatDate(message.created_at)}</span>
                                        </div>
                                        <span className="message-email">{message.email}</span>
                                        <p className="message-preview">{message.message}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="message-detail">
                        {selectedMessage ? (
                            <>
                                <div className="detail-header">
                                    <h2>{selectedMessage.name}</h2>
                                    <div className="detail-actions">
                                        <button
                                            className="action-btn delete"
                                            onClick={() => handleDelete(selectedMessage.id)}
                                            title="Eliminar"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="detail-info">
                                    <div className="info-item">
                                        <Mail size={16} />
                                        <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>
                                    </div>
                                    {selectedMessage.phone && (
                                        <div className="info-item">
                                            <Phone size={16} />
                                            <a href={`tel:${selectedMessage.phone}`}>{selectedMessage.phone}</a>
                                        </div>
                                    )}
                                    <div className="info-item">
                                        <Calendar size={16} />
                                        <span>{formatDate(selectedMessage.created_at)}</span>
                                    </div>
                                </div>

                                <div className="detail-message">
                                    <h3>Mensaje:</h3>
                                    <p>{selectedMessage.message}</p>
                                </div>

                                <div className="detail-footer">
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: Contacto desde Grupo Ingcor`}
                                        className="btn btn-primary"
                                    >
                                        <Mail size={18} />
                                        <span>Responder por email</span>
                                    </a>
                                </div>
                            </>
                        ) : (
                            <div className="empty-detail">
                                <Eye size={48} />
                                <p>Selecciona un mensaje para ver los detalles</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessagesManager;
