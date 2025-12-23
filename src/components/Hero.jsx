import { useState, useEffect } from 'react';
import { ArrowRight, Building2, Wrench, Shield } from 'lucide-react';
import { siteSettingsApi } from '../lib/supabase';
import './Hero.css';

const Hero = () => {
    const [heroImage, setHeroImage] = useState('');

    useEffect(() => {
        const loadHeroImage = async () => {
            try {
                const image = await siteSettingsApi.get('hero_image');
                if (image) setHeroImage(image);
            } catch (error) {
                console.error('Error cargando imagen del hero:', error);
            }
        };
        loadHeroImage();
    }, []);

    const scrollToContact = () => {
        const element = document.getElementById('contacto');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToProjects = () => {
        const element = document.getElementById('proyectos');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="inicio" className="hero">
            <div className="hero-background">
                <div className="hero-gradient"></div>
                <div className="hero-pattern"></div>
            </div>

            <div className="hero-container">
                <div className="hero-content">
                    <div className="hero-badge">
                        <Shield size={16} />
                        <span>+15 años de experiencia</span>
                    </div>

                    <h1 className="hero-title">
                        Mantenimiento <span className="highlight">integral</span> para
                        <span className="highlight-secondary"> edificios</span> y espacios
                    </h1>

                    <p className="hero-description">
                        En <strong>Grupo Ingcor</strong> nos especializamos en brindar soluciones
                        profesionales de mantenimiento preventivo y correctivo para edificios,
                        oficinas, centros comerciales e instalaciones industriales.
                    </p>

                    <div className="hero-actions">
                        <button onClick={scrollToContact} className="btn btn-primary btn-lg">
                            Solicitar cotización
                            <ArrowRight size={20} />
                        </button>
                        <button onClick={scrollToProjects} className="btn btn-secondary btn-lg">
                            Ver proyectos
                        </button>
                    </div>

                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-number">500+</span>
                            <span className="stat-label">Proyectos completados</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <span className="stat-number">150+</span>
                            <span className="stat-label">Clientes satisfechos</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <span className="stat-number">24/7</span>
                            <span className="stat-label">Soporte disponible</span>
                        </div>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="hero-card hero-card-1">
                        <Building2 size={32} />
                        <span>Edificios corporativos</span>
                    </div>
                    <div className="hero-card hero-card-2">
                        <Wrench size={32} />
                        <span>Mantenimiento integral</span>
                    </div>
                    <div className="hero-image-container">
                        {heroImage ? (
                            <img
                                src={heroImage}
                                alt="Equipo de Grupo Ingcor"
                                className="hero-team-image"
                            />
                        ) : (
                            <div className="hero-image-placeholder">
                                <Building2 size={120} strokeWidth={1} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="hero-scroll-indicator">
                <div className="scroll-mouse">
                    <div className="scroll-wheel"></div>
                </div>
                <span>Scroll para explorar</span>
            </div>
        </section>
    );
};

export default Hero;
