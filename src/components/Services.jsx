import {
    Wrench,
    Zap,
    Droplets,
    Wind,
    PaintBucket,
    Shield,
    ArrowRight
} from 'lucide-react';
import './Services.css';

const services = [
    {
        icon: Wrench,
        title: 'Mantenimiento General',
        description: 'Reparaciones y mantenimiento preventivo de instalaciones, mobiliario y estructuras.',
        color: 'primary'
    },
    {
        icon: Zap,
        title: 'Instalaciones Eléctricas',
        description: 'Mantenimiento y reparación de sistemas eléctricos, iluminación y tableros.',
        color: 'secondary'
    },
    {
        icon: Droplets,
        title: 'Plomería e Hidráulica',
        description: 'Servicios completos de fontanería, detección de fugas y sistemas de agua.',
        color: 'accent'
    },
    {
        icon: Wind,
        title: 'Aire Acondicionado',
        description: 'Instalación, mantenimiento y reparación de sistemas HVAC y climatización.',
        color: 'primary'
    },
    {
        icon: PaintBucket,
        title: 'Acabados y Pintura',
        description: 'Renovación de espacios, pintura interior/exterior y acabados profesionales.',
        color: 'secondary'
    },
    {
        icon: Shield,
        title: 'Impermeabilización',
        description: 'Protección de techos, muros y cimentaciones contra humedad y filtraciones.',
        color: 'accent'
    }
];

const Services = () => {
    return (
        <section id="servicios" className="services section">
            <div className="container">
                <h2 className="section-title">
                    Nuestros <span className="highlight">Servicios</span>
                </h2>
                <p className="section-subtitle">
                    Ofrecemos soluciones integrales de mantenimiento para mantener
                    tus instalaciones en óptimas condiciones.
                </p>

                <div className="services-grid">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`service-card service-card-${service.color}`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="service-icon">
                                <service.icon size={32} />
                            </div>
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-description">{service.description}</p>
                            {/* <button className="service-link">
                                <span>Más información</span>
                                <ArrowRight size={16} />
                            </button> */}
                        </div>
                    ))}
                </div>

                <div className="services-cta">
                    <p>¿Necesitas un servicio personalizado?</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Contáctanos
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Services;
