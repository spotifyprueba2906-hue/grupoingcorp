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
    Image as ImageIcon,
    Images
} from 'lucide-react';
import { projectsApi, projectImagesApi, storageApi } from '../../lib/supabase';
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
    const [additionalImages, setAdditionalImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadingAdditional, setUploadingAdditional] = useState(false);
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
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    // Subir imagen principal
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

    // Subir imágenes adicionales
    const handleAdditionalImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploadingAdditional(true);
        try {
            const uploadPromises = files.map(file => storageApi.uploadImage(file));
            const urls = await Promise.all(uploadPromises);
            setAdditionalImages(prev => [...prev, ...urls.map(url => ({ url, isNew: true }))]);
        } catch (error) {
            console.error('Error subiendo imágenes:', error);
            alert('Error al subir las imágenes.');
        } finally {
            setUploadingAdditional(false);
        }
    };

    // Eliminar imagen adicional
    const removeAdditionalImage = async (index) => {
        const image = additionalImages[index];
        try {
            if (image.id) {
                await projectImagesApi.delete(image.id);
            }
            setAdditionalImages(prev => prev.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Error eliminando imagen:', error);
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
            // Cargar imágenes adicionales existentes
            setAdditionalImages(
                (project.project_images || []).map(img => ({
                    id: img.id,
                    url: img.image_url,
                    isNew: false
                }))
            );
        } else {
            setEditingProject(null);
            setFormData({
                title: '',
                description: '',
                category: '',
                image_url: '',
                featured: false
            });
            setAdditionalImages([]);
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
        setAdditionalImages([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title) {
            alert('El título es requerido');
            return;
        }

        setSaving(true);
        try {
            let projectId;

            if (editingProject) {
                await projectsApi.update(editingProject.id, formData);
                projectId = editingProject.id;
            } else {
                const newProject = await projectsApi.create(formData);
                projectId = newProject.id;
            }

            // Guardar imágenes adicionales nuevas
            for (let i = 0; i < additionalImages.length; i++) {
                const img = additionalImages[i];
                if (img.isNew) {
                    await projectImagesApi.add(projectId, img.url, i);
                }
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
        if (!confirm('¿Estás seguro de eliminar este proyecto? Se eliminarán también todas sus imágenes.')) return;

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

    // Obtener la primera imagen (principal o de la galería)
    const getMainImage = (project) => {
        if (project.image_url) return project.image_url;
        if (project.project_images && project.project_images.length > 0) {
            return project.project_images[0].image_url;
        }
        return null;
    };

    // Contar total de imágenes
    const getImageCount = (project) => {
        let count = project.image_url ? 1 : 0;
        count += (project.project_images || []).length;
        return count;
    };

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
                                {getMainImage(project) ? (
                                    <img src={getMainImage(project)} alt={project.title} />
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
                                {getImageCount(project) > 1 && (
                                    <span className="images-count-badge">
                                        <Images size={14} />
                                        {getImageCount(project)}
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
                    <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
                            <button className="modal-close" onClick={closeModal}>
                                <X size={24} />
                            </button>
                        </div>

                        <form className="modal-form" onSubmit={handleSubmit}>
                            <div className="form-row">
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
                                <label className="form-label">Imagen Principal</label>
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
                                            <span>{uploading ? 'Subiendo...' : 'Subir imagen principal'}</span>
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <Images size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                    Galería de Imágenes Adicionales
                                </label>

                                <div className="gallery-grid">
                                    {additionalImages.map((img, index) => (
                                        <div key={index} className="gallery-item">
                                            <img src={img.url} alt={`Imagen ${index + 1}`} />
                                            <button
                                                type="button"
                                                className="remove-gallery-image"
                                                onClick={() => removeAdditionalImage(index)}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}

                                    <label className="gallery-add">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleAdditionalImageUpload}
                                            disabled={uploadingAdditional}
                                        />
                                        {uploadingAdditional ? (
                                            <Loader2 size={24} className="spinner-icon" />
                                        ) : (
                                            <Plus size={24} />
                                        )}
                                        <span>{uploadingAdditional ? 'Subiendo...' : 'Agregar'}</span>
                                    </label>
                                </div>
                                <p className="form-hint">Puedes agregar múltiples imágenes para mostrar en la galería del proyecto</p>
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
