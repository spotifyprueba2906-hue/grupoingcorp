import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <svg viewBox="0 0 50 50" className="logo-icon">
                                <circle cx="25" cy="25" r="20" fill="none" stroke="url(#gradFooter1)" strokeWidth="3" />
                                <circle cx="25" cy="25" r="14" fill="none" stroke="url(#gradFooter2)" strokeWidth="2" />
                                <text x="25" y="31" textAnchor="middle" fill="#00A651" fontSize="16" fontWeight="bold">G</text>
                                <defs>
                                    <linearGradient id="gradFooter1" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#00AEEF" />
                                        <stop offset="50%" stopColor="#00A651" />
                                        <stop offset="100%" stopColor="#EC008C" />
                                    </linearGradient>
                                    <linearGradient id="gradFooter2" x1="100%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#EC008C" />
                                        <stop offset="100%" stopColor="#00AEEF" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span className="logo-text">GRUPO <strong>INGCOR</strong></span>
                        </Link>
                        <p className="footer-description">
                            Expertos en mantenimiento integral de edificios y espacios comerciales.
                            Más de 15 años brindando soluciones profesionales.
                        </p>
                        <div className="footer-social">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                <Facebook size={20} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                <Instagram size={20} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4>Enlaces rápidos</h4>
                        <ul>
                            <li><button onClick={() => scrollToSection('inicio')}>Inicio</button></li>
                            <li><button onClick={() => scrollToSection('servicios')}>Servicios</button></li>
                            <li><button onClick={() => scrollToSection('proyectos')}>Proyectos</button></li>
                            <li><button onClick={() => scrollToSection('nosotros')}>Nosotros</button></li>
                            <li><button onClick={() => scrollToSection('contacto')}>Contacto</button></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Servicios</h4>
                        <ul>
                            <li><span>Mantenimiento General</span></li>
                            <li><span>Instalaciones Eléctricas</span></li>
                            <li><span>Plomería e Hidráulica</span></li>
                            <li><span>Aire Acondicionado</span></li>
                            <li><span>Impermeabilización</span></li>
                        </ul>
                    </div>

                    <div className="footer-contact">
                        <h4>Contacto</h4>
                        <ul>
                            <li>
                                <Phone size={16} />
                                <a href="tel:+525500000000">+52 55 0000 0000</a>
                            </li>
                            <li>
                                <Mail size={16} />
                                <a href="mailto:contacto@grupoingcor.com">contacto@grupoingcor.com</a>
                            </li>
                            <li>
                                <MapPin size={16} />
                                <span>Ciudad de México, México</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {currentYear} Grupo Ingcor. Todos los derechos reservados.</p>
                    <div className="footer-legal">
                        <Link to="/privacidad">Aviso de Privacidad</Link>
                        <Link to="/terminos">Términos y Condiciones</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
