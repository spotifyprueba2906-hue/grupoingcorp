import { useState, useEffect } from 'react';
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    Upload,
    X,
    Loader2,
    Star,
    Image as ImageIcon
} from 'lucide-react';
import { projectsApi, storageApi } from '../../lib/supabase';
import './Manager.css';

const ProjectsManager = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        image_url: '',
        featured: false
    });
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const categories = [
        'Edificio Corporativo',
        'Centro Comercial',
        'Residencial',
        'Industrial',
        'Institucional',
        'Hotelero'
    ];

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await projectsApi.getAll();
            setProjects(data || []);
        } catch (error) {
            console.error('Error cargando proyectos:', error);
            // Mostrar proyectos demo si falla la carga
            setProjects([
                { id: 1, title: 'Proyecto Demo 1', description: 'Descripción demo', category: 'Residencial', featured: true },
                { id: 2, title: 'Proyecto Demo 2', description: 'Descripción demo', category: 'Industrial', featured: false },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await storageApi.uploadImage(file);
            setFormData(prev => ({ ...prev, image_url: url }));
        } catch (error) {
            console.error('Error subiendo imagen:', error);
            alert('Error al subir la imagen. Por favor intenta de nuevo.');
        } finally {
            setUploading(false);
        }
    };

    const openModal = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title,
                description: project.description || '',
                category: project.category || '',
                image_url: project.image_url || '',
                featured: project.featured || false
            });
        } else {
            setEditingProject(null);
            setFormData({
                title: '',
                description: '',
                category: '',
                image_url: '',
                featured: false
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProject(null);
        setFormData({
            title: '',
            description: '',
            category: '',
            image_url: '',
            featured: false
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title) {
            alert('El título es requerido');
            return;
        }

        setSaving(true);
        try {
            if (editingProject) {
                await projectsApi.update(editingProject.id, formData);
            } else {
                await projectsApi.create(formData);
            }
            await loadProjects();
            closeModal();
        } catch (error) {
            console.error('Error guardando proyecto:', error);
            alert('Error al guardar el proyecto. Por favor intenta de nuevo.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

        try {
            await projectsApi.delete(id);
            await loadProjects();
        } catch (error) {
            console.error('Error eliminando proyecto:', error);
            alert('Error al eliminar el proyecto.');
        }
    };

    const filteredProjects = projects.filter(p =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="manager-page">
            <div className="manager-header">
                <div>
                    <h1>Gestión de Proyectos</h1>
                    <p>Administra los proyectos que se muestran en la galería</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <Plus size={20} />
                    <span>Nuevo Proyecto</span>
                </button>
            </div>

            <div className="manager-toolbar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Buscar proyectos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <span className="results-count">{filteredProjects.length} proyectos</span>
            </div>

            {loading ? (
                <div className="manager-loading">
                    <div className="spinner"></div>
                    <p>Cargando proyectos...</p>
                </div>
            ) : (
                <div className="manager-grid">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="manager-card">
                            <div className="manager-card-image">
                                {project.image_url ? (
                                    <img src={project.image_url} alt={project.title} />
                                ) : (
                                    <div className="image-placeholder">
                                        <ImageIcon size={32} />
                                    </div>
                                )}
                                {project.featured && (
                                    <span className="featured-badge">
                                        <Star size={14} />
                                        Destacado
                                    </span>
                                )}
                            </div>
                            <div className="manager-card-content">
                                <span className="card-category">{project.category}</span>
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>
                            </div>
                            <div className="manager-card-actions">
                                <button className="action-btn edit" onClick={() => openModal(project)}>
                                    <Pencil size={16} />
                                </button>
                                <button className="action-btn delete" onClick={() => handleDelete(project.id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
                            <button className="modal-close" onClick={closeModal}>
                                <X size={24} />
                            </button>
                        </div>

                        <form className="modal-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Título *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Nombre del proyecto"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Categoría</label>
                                <select
                                    className="form-input"
                                    value={formData.category}
                                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                >
                                    <option value="">Seleccionar categoría</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Descripción</label>
                                <textarea
                                    className="form-textarea"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Descripción del proyecto..."
                                    rows="3"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Imagen</label>
                                <div className="upload-area">
                                    {formData.image_url ? (
                                        <div className="upload-preview">
                                            <img src={formData.image_url} alt="Preview" />
                                            <button
                                                type="button"
                                                className="remove-image"
                                                onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="upload-label">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                disabled={uploading}
                                            />
                                            {uploading ? (
                                                <Loader2 size={24} className="spinner-icon" />
                                            ) : (
                                                <Upload size={24} />
                                            )}
                                            <span>{uploading ? 'Subiendo...' : 'Subir imagen'}</span>
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                                    />
                                    <span>Marcar como destacado</span>
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={closeModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? (
                                        <>
                                            <Loader2 size={18} className="spinner-icon" />
                                            <span>Guardando...</span>
                                        </>
                                    ) : (
                                        <span>{editingProject ? 'Actualizar' : 'Crear'} Proyecto</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsManager;
