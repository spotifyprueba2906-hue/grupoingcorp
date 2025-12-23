import { useState, useEffect } from 'react';
import {
    Save,
    Upload,
    X,
    Loader2,
    Phone,
    Mail,
    MapPin,
    Image as ImageIcon,
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
    CheckCircle
} from 'lucide-react';
import { siteSettingsApi, storageApi } from '../../lib/supabase';
import './Manager.css';

const SettingsManager = () => {
    const [settings, setSettings] = useState({
        hero_image: '',
        contact_phone: '',
        contact_email: '',
        contact_address: '',
        social_facebook: '',
        social_instagram: '',
        social_linkedin: '',
        social_twitter: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await siteSettingsApi.getAll();
            setSettings(prev => ({ ...prev, ...data }));
        } catch (error) {
            console.error('Error cargando configuración:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await storageApi.uploadImage(file, 'hero');
            setSettings(prev => ({ ...prev, hero_image: url }));
        } catch (error) {
            console.error('Error subiendo imagen:', error);
            alert('Error al subir la imagen.');
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await siteSettingsApi.updateMany(settings);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Error guardando configuración:', error);
            alert('Error al guardar la configuración.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="manager-loading">
                <div className="spinner"></div>
                <p>Cargando configuración...</p>
            </div>
        );
    }

    return (
        <div className="manager-page settings-page">
            <div className="manager-header">
                <div>
                    <h1>Configuración del Sitio</h1>
                    <p>Administra la información de contacto y contenido del sitio</p>
                </div>
                <button
                    className={`btn btn-primary ${saved ? 'btn-success' : ''}`}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <>
                            <Loader2 size={20} className="spinner-icon" />
                            <span>Guardando...</span>
                        </>
                    ) : saved ? (
                        <>
                            <CheckCircle size={20} />
                            <span>¡Guardado!</span>
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            <span>Guardar Cambios</span>
                        </>
                    )}
                </button>
            </div>

            <div className="settings-grid">
                {/* Imagen del Hero */}
                <div className="settings-card">
                    <div className="settings-card-header">
                        <ImageIcon size={24} />
                        <h2>Imagen Principal (Hero)</h2>
                    </div>
                    <p className="settings-description">
                        Esta imagen se mostrará en la sección principal del sitio.
                        Recomendamos una foto del equipo o de un proyecto destacado.
                    </p>

                    <div className="hero-image-upload">
                        {settings.hero_image ? (
                            <div className="hero-image-preview">
                                <img src={settings.hero_image} alt="Hero" />
                                <button
                                    className="remove-hero-image"
                                    onClick={() => handleChange('hero_image', '')}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ) : (
                            <label className="hero-image-placeholder">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                                {uploading ? (
                                    <Loader2 size={32} className="spinner-icon" />
                                ) : (
                                    <Upload size={32} />
                                )}
                                <span>{uploading ? 'Subiendo...' : 'Subir imagen del Hero'}</span>
                                <small>Tamaño recomendado: 800x600px</small>
                            </label>
                        )}
                    </div>
                </div>

                {/* Información de Contacto */}
                <div className="settings-card">
                    <div className="settings-card-header">
                        <Phone size={24} />
                        <h2>Información de Contacto</h2>
                    </div>
                    <p className="settings-description">
                        Esta información se mostrará en el footer y la sección de contacto.
                    </p>

                    <div className="settings-form">
                        <div className="settings-field">
                            <label>
                                <Phone size={16} />
                                Teléfono
                            </label>
                            <input
                                type="text"
                                value={settings.contact_phone}
                                onChange={(e) => handleChange('contact_phone', e.target.value)}
                                placeholder="+52 55 1234 5678"
                            />
                        </div>

                        <div className="settings-field">
                            <label>
                                <Mail size={16} />
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                value={settings.contact_email}
                                onChange={(e) => handleChange('contact_email', e.target.value)}
                                placeholder="contacto@grupoingcor.com"
                            />
                        </div>

                        <div className="settings-field">
                            <label>
                                <MapPin size={16} />
                                Dirección
                            </label>
                            <input
                                type="text"
                                value={settings.contact_address}
                                onChange={(e) => handleChange('contact_address', e.target.value)}
                                placeholder="Ciudad de México, CDMX"
                            />
                        </div>
                    </div>
                </div>

                {/* Redes Sociales */}
                <div className="settings-card">
                    <div className="settings-card-header">
                        <Instagram size={24} />
                        <h2>Redes Sociales</h2>
                    </div>
                    <p className="settings-description">
                        Agrega los enlaces a tus redes sociales. Déjalos vacíos si no los usas.
                    </p>

                    <div className="settings-form">
                        <div className="settings-field">
                            <label>
                                <Facebook size={16} />
                                Facebook
                            </label>
                            <input
                                type="url"
                                value={settings.social_facebook}
                                onChange={(e) => handleChange('social_facebook', e.target.value)}
                                placeholder="https://facebook.com/grupoingcor"
                            />
                        </div>

                        <div className="settings-field">
                            <label>
                                <Instagram size={16} />
                                Instagram
                            </label>
                            <input
                                type="url"
                                value={settings.social_instagram}
                                onChange={(e) => handleChange('social_instagram', e.target.value)}
                                placeholder="https://instagram.com/grupoingcor"
                            />
                        </div>

                        <div className="settings-field">
                            <label>
                                <Linkedin size={16} />
                                LinkedIn
                            </label>
                            <input
                                type="url"
                                value={settings.social_linkedin}
                                onChange={(e) => handleChange('social_linkedin', e.target.value)}
                                placeholder="https://linkedin.com/company/grupoingcor"
                            />
                        </div>

                        <div className="settings-field">
                            <label>
                                <Twitter size={16} />
                                Twitter / X
                            </label>
                            <input
                                type="url"
                                value={settings.social_twitter}
                                onChange={(e) => handleChange('social_twitter', e.target.value)}
                                placeholder="https://twitter.com/grupoingcor"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsManager;
