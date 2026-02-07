import { Award, Users, Clock, CheckCircle } from 'lucide-react';
import './About.css';

const stats = [
    { icon: Award, value: '3+', label: 'Años de experiencia' },
    { icon: Users, value: '10+', label: 'Clientes satisfechos' },
    { icon: Clock, value: '24/7', label: 'Disponibilidad' },
    { icon: CheckCircle, value: '20+', label: 'Proyectos completados' }
];

const values = [
    'Profesionalismo y ética en cada proyecto',
    'Personal capacitado y certificado',
    'Uso de materiales de primera calidad',
    'Cumplimiento de normas de seguridad',
    'Garantía en todos nuestros servicios',
    'Atención personalizada al cliente'
];

const About = () => {
    return (
        <section id="nosotros" className="about section">
            <div className="container">
                <div className="about-grid">
                    <div className="about-content">
                        <h2 className="section-title text-left">
                            Sobre <span className="highlight">Grupo Ingcor</span>
                        </h2>
                        <p className="about-description">
                            Somos una empresa líder en servicios de mantenimiento integral para
                            edificios, centros comerciales, oficinas corporativas e instalaciones
                            industriales. Con más de 3 años de experiencia, nos hemos consolidado
                            como un aliado estratégico de nuestros clientes.
                        </p>
                        <p className="about-description">
                            Nuestro equipo de profesionales altamente capacitados se especializa
                            en brindar soluciones efectivas y eficientes para mantener tus
                            instalaciones en óptimas condiciones.
                        </p>

                        <div className="about-values">
                            <h3>¿Por qué elegirnos?</h3>
                            <ul className="values-list">
                                {values.map((value, index) => (
                                    <li key={index} className="value-item">
                                        <CheckCircle size={20} />
                                        <span>{value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="about-stats">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card">
                                <div className="stat-icon">
                                    <stat.icon size={28} />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">{stat.value}</span>
                                    <span className="stat-label">{stat.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
