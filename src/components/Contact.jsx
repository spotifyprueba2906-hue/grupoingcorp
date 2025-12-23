import { useState, useEffect } from 'react';
import { Send, Phone, Mail, MapPin, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { messagesApi, siteSettingsApi } from '../lib/supabase';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        contact_phone: '+52 55 0000 0000',
        contact_email: 'contacto@grupoingcor.com',
        contact_address: 'Ciudad de México, México'
    });

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const data = await siteSettingsApi.getAll();
                if (data) setSettings(prev => ({ ...prev, ...data }));
            } catch (error) {
                console.error('Error cargando configuración:', error);
            }
        };
        loadSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        // Validación básica
        if (!formData.name || !formData.email || !formData.message) {
            setStatus({
                type: 'error',
                message: 'Por favor completa todos los campos requeridos.'
            });
            setLoading(false);
            return;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setStatus({
                type: 'error',
                message: 'Por favor ingresa un email válido.'
            });
            setLoading(false);
            return;
        }

        try {
            await messagesApi.create({
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim() || null,
                message: formData.message.trim()
            });

            setStatus({
                type: 'success',
                message: '¡Mensaje enviado! Nos pondremos en contacto contigo pronto.'
            });
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            setStatus({
                type: 'error',
                message: 'Hubo un error al enviar el mensaje. Por favor intenta de nuevo.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contacto" className="contact section">
            <div className="container">
                <h2 className="section-title">
                    <span className="highlight">Contáctanos</span>
                </h2>
                <p className="section-subtitle">
                    ¿Tienes un proyecto en mente? Escríbenos y te responderemos
                    en menos de 24 horas.
                </p>

                <div className="contact-grid">
                    <div className="contact-info">
                        <h3>Información de contacto</h3>
                        <p className="contact-intro">
                            Estamos listos para ayudarte con tu próximo proyecto de
                            mantenimiento. No dudes en contactarnos.
                        </p>

                        <div className="contact-details">
                            {settings.contact_phone && (
                                <a href={`tel:${settings.contact_phone.replace(/\s/g, '')}`} className="contact-item">
                                    <div className="contact-icon">
                                        <Phone size={24} />
                                    </div>
                                    <div className="contact-text">
                                        <span className="contact-label">Teléfono</span>
                                        <span className="contact-value">{settings.contact_phone}</span>
                                    </div>
                                </a>
                            )}

                            {settings.contact_email && (
                                <a href={`mailto:${settings.contact_email}`} className="contact-item">
                                    <div className="contact-icon">
                                        <Mail size={24} />
                                    </div>
                                    <div className="contact-text">
                                        <span className="contact-label">Email</span>
                                        <span className="contact-value">{settings.contact_email}</span>
                                    </div>
                                </a>
                            )}

                            {settings.contact_address && (
                                <div className="contact-item">
                                    <div className="contact-icon">
                                        <MapPin size={24} />
                                    </div>
                                    <div className="contact-text">
                                        <span className="contact-label">Ubicación</span>
                                        <span className="contact-value">{settings.contact_address}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="contact-hours">
                            <h4>Horario de atención</h4>
                            <p>Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                            <p>Sábados: 9:00 AM - 2:00 PM</p>
                            <p className="emergency">Emergencias: 24/7</p>
                        </div>
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label" htmlFor="name">
                                    Nombre completo *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-input"
                                    placeholder="Tu nombre"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="email">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="tu@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="phone">
                                Teléfono (opcional)
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                className="form-input"
                                placeholder="+52 55 0000 0000"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="message">
                                Mensaje *
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                className="form-textarea"
                                placeholder="Cuéntanos sobre tu proyecto o necesidad..."
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {status.message && (
                            <div className={`form-status ${status.type}`}>
                                {status.type === 'success' ? (
                                    <CheckCircle size={20} />
                                ) : (
                                    <AlertCircle size={20} />
                                )}
                                <span>{status.message}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg btn-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="spinner-icon" />
                                    <span>Enviando...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    <span>Enviar mensaje</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
