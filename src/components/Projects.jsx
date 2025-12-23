import { useState, useEffect } from 'react';
import { ExternalLink, Images } from 'lucide-react';
import { projectsApi } from '../lib/supabase';
import ProjectGallery from './ProjectGallery';
import './Projects.css';

const categories = ['Todos', 'Edificio Corporativo', 'Centro Comercial', 'Residencial', 'Industrial', 'Institucional', 'Hotelero'];

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);

    // Cargar proyectos de Supabase
    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await projectsApi.getAll();
                setProjects(data || []);
                setFilteredProjects(data || []);
            } catch (error) {
                console.error('Error cargando proyectos:', error);
                setProjects([]);
                setFilteredProjects([]);
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, []);

    // Filtrar por categoría
    useEffect(() => {
        if (activeCategory === 'Todos') {
            setFilteredProjects(projects);
        } else {
            setFilteredProjects(projects.filter(p => p.category === activeCategory));
        }
    }, [activeCategory, projects]);

    // Obtener imagen principal
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

    // Verificar si el proyecto tiene imágenes
    const hasImages = (project) => {
        return getMainImage(project) !== null;
    };

    return (
        <section id="proyectos" className="projects section">
            <div className="container">
                <h2 className="section-title">
                    Proyectos <span className="highlight">Realizados</span>
                </h2>
                <p className="section-subtitle">
                    Conoce algunos de los proyectos que hemos completado exitosamente
                    para nuestros clientes.
                </p>

                <div className="projects-filter">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                            onClick={() => setActiveCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="projects-loading">
                        <div className="spinner"></div>
                        <p>Cargando proyectos...</p>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="projects-empty">
                        <p>No hay proyectos disponibles en esta categoría.</p>
                    </div>
                ) : (
                    <div className="projects-grid">
                        {filteredProjects.map((project, index) => (
                            <div
                                key={project.id}
                                className="project-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="project-image">
                                    {getMainImage(project) ? (
                                        <img src={getMainImage(project)} alt={project.title} />
                                    ) : (
                                        <div className="project-placeholder">
                                            <span>{project.category?.charAt(0) || 'P'}</span>
                                        </div>
                                    )}

                                    {/* Badge de cantidad de imágenes */}
                                    {getImageCount(project) > 1 && (
                                        <span className="project-images-badge">
                                            <Images size={14} />
                                            {getImageCount(project)}
                                        </span>
                                    )}

                                    <div className="project-overlay">
                                        {hasImages(project) && (
                                            <button
                                                className="project-view-btn"
                                                onClick={() => setSelectedProject(project)}
                                            >
                                                <ExternalLink size={20} />
                                                <span>Ver detalles</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="project-content">
                                    <span className="project-category">{project.category}</span>
                                    <h3 className="project-title">{project.title}</h3>
                                    <p className="project-description">{project.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de galería */}
            {selectedProject && (
                <ProjectGallery
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </section>
    );
};

export default Projects;
