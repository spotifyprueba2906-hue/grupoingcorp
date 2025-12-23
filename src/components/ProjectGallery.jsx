import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import './ProjectGallery.css';

const ProjectGallery = ({ project, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Combinar imagen principal + imágenes adicionales
    const allImages = [];
    if (project.image_url) {
        allImages.push(project.image_url);
    }
    if (project.project_images && project.project_images.length > 0) {
        project.project_images
            .sort((a, b) => a.display_order - b.display_order)
            .forEach(img => allImages.push(img.image_url));
    }

    // Navegación con teclado
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [currentIndex]);

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    if (allImages.length === 0) {
        return null;
    }

    return (
        <div className="gallery-modal-overlay" onClick={onClose}>
            <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
                <button className="gallery-close" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="gallery-content">
                    <div className="gallery-main">
                        {allImages.length > 1 && (
                            <button className="gallery-nav prev" onClick={prevImage}>
                                <ChevronLeft size={32} />
                            </button>
                        )}

                        <div className="gallery-image-container">
                            <img
                                src={allImages[currentIndex]}
                                alt={`${project.title} - Imagen ${currentIndex + 1}`}
                            />
                        </div>

                        {allImages.length > 1 && (
                            <button className="gallery-nav next" onClick={nextImage}>
                                <ChevronRight size={32} />
                            </button>
                        )}
                    </div>

                    <div className="gallery-info">
                        <span className="gallery-category">{project.category}</span>
                        <h2>{project.title}</h2>
                        <p>{project.description}</p>

                        {allImages.length > 1 && (
                            <div className="gallery-counter">
                                {currentIndex + 1} / {allImages.length}
                            </div>
                        )}
                    </div>

                    {allImages.length > 1 && (
                        <div className="gallery-thumbnails">
                            {allImages.map((img, index) => (
                                <button
                                    key={index}
                                    className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentIndex(index)}
                                >
                                    <img src={img} alt={`Miniatura ${index + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectGallery;
