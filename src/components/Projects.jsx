import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import './Projects.css';

// Proyectos de demostración (se reemplazarán con datos de Supabase)
const demoProjects = [
    {
        id: 1,
        title: 'Torre Corporativa Santa Fe',
        description: 'Mantenimiento integral de 25 pisos incluyendo sistemas eléctricos, HVAC y áreas comunes.',
        category: 'Edificio Corporativo',
        image_url: null,
        featured: true
    },
    {
        id: 2,
        title: 'Centro Comercial Plaza Mayor',
        description: 'Renovación completa de sistemas de iluminación y aire acondicionado.',
        category: 'Centro Comercial',
        image_url: null,
        featured: true
    },
    {
        id: 3,
        title: 'Residencial Los Pinos',
        description: 'Impermeabilización y mantenimiento de áreas comunes en conjunto residencial.',
        category: 'Residencial',
        image_url: null,
        featured: true
    },
    {
        id: 4,
        title: 'Hospital Regional Norte',
        description: 'Mantenimiento preventivo de instalaciones críticas y sistemas de emergencia.',
        category: 'Institucional',
        image_url: null,
        featured: false
    },
    {
        id: 5,
        title: 'Planta Industrial Monterrey',
        description: 'Mantenimiento de naves industriales y sistemas hidráulicos.',
        category: 'Industrial',
        image_url: null,
        featured: false
    },
    {
        id: 6,
        title: 'Hotel Boutique Centro',
        description: 'Remodelación y actualización de instalaciones eléctricas.',
        category: 'Hotelero',
        image_url: null,
        featured: false
    }
];

const categories = ['Todos', 'Edificio Corporativo', 'Centro Comercial', 'Residencial', 'Industrial', 'Institucional', 'Hotelero'];

const Projects = () => {
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [filteredProjects, setFilteredProjects] = useState(demoProjects);

    useEffect(() => {
        if (activeCategory === 'Todos') {
            setFilteredProjects(demoProjects);
        } else {
            setFilteredProjects(demoProjects.filter(p => p.category === activeCategory));
        }
    }, [activeCategory]);

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

                <div className="projects-grid">
                    {filteredProjects.map((project, index) => (
                        <div
                            key={project.id}
                            className="project-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="project-image">
                                {project.image_url ? (
                                    <img src={project.image_url} alt={project.title} />
                                ) : (
                                    <div className="project-placeholder">
                                        <span>{project.category.charAt(0)}</span>
                                    </div>
                                )}
                                <div className="project-overlay">
                                    <button className="project-view-btn">
                                        <ExternalLink size={20} />
                                        <span>Ver detalles</span>
                                    </button>
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
            </div>
        </section>
    );
};

export default Projects;
