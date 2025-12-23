import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
    };

    return (
        <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <div className="navbar-logo">
                        <svg viewBox="0 0 50 50" className="logo-icon">
                            <circle cx="25" cy="25" r="20" fill="none" stroke="url(#grad1)" strokeWidth="3" />
                            <circle cx="25" cy="25" r="14" fill="none" stroke="url(#grad2)" strokeWidth="2" />
                            <text x="25" y="31" textAnchor="middle" fill="#00A651" fontSize="16" fontWeight="bold">G</text>
                            <defs>
                                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#00AEEF" />
                                    <stop offset="50%" stopColor="#00A651" />
                                    <stop offset="100%" stopColor="#EC008C" />
                                </linearGradient>
                                <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#EC008C" />
                                    <stop offset="100%" stopColor="#00AEEF" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span className="logo-text">GRUPO <strong>INGCOR</strong></span>
                    </div>
                </Link>

                <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
                    <button onClick={() => scrollToSection('inicio')} className="navbar-link">
                        Inicio
                    </button>
                    <button onClick={() => scrollToSection('servicios')} className="navbar-link">
                        Servicios
                    </button>
                    <button onClick={() => scrollToSection('proyectos')} className="navbar-link">
                        Proyectos
                    </button>
                    <button onClick={() => scrollToSection('nosotros')} className="navbar-link">
                        Nosotros
                    </button>
                    <button onClick={() => scrollToSection('contacto')} className="navbar-link">
                        Contacto
                    </button>
                    <a href="tel:+525500000000" className="navbar-cta">
                        <Phone size={18} />
                        <span>Llamar ahora</span>
                    </a>
                </div>

                <button
                    className="navbar-toggle"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
