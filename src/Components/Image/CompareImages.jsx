import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CompareImages = () => {
    const location = useLocation();
    const { originalImage, resultImage } = location.state || {};

    const [offsetX, setOffsetX] = useState(400);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef(null);

    useEffect(() => {
        if (originalImage) {
            const img = new Image();
            img.src = originalImage;
            img.onload = () => {
                const maxWidth = window.innerWidth * 0.9; // 90% of screen width
                const maxHeight = window.innerHeight * 0.8; // 80% of screen height

                let { width, height } = img;

                // Scale down if too large
                const widthRatio = maxWidth / width;
                const heightRatio = maxHeight / height;
                const scale = Math.min(widthRatio, heightRatio, 1);

                setImageDimensions({
                    width: width * scale,
                    height: height * scale,
                });
            };
        }
    }, [originalImage]);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        let newX = e.clientX - rect.left;
        if (newX < 0) newX = 0;
        if (newX > rect.width) newX = rect.width;
        setOffsetX(newX);
    };

    const handleTouchMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        let newX = e.touches[0].clientX - rect.left;
        if (newX < 0) newX = 0;
        if (newX > rect.width) newX = rect.width;
        setOffsetX(newX);
    };

    if (!originalImage || !resultImage) {
        return <p style={{ textAlign: 'center', marginTop: '2rem' }}>No images to compare. Please upload first.</p>;
    }

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            style={{
                position: 'relative',
                width: `${imageDimensions.width}px`,
                height: `${imageDimensions.height}px`,
                overflow: 'hidden',
                cursor: 'ew-resize',
                margin: '2rem auto',
                background: '#000',
                borderRadius: '8px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
            }}
        >
            <img
                src={originalImage}
                alt="Original"
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    top: 0,
                    left: 0,
                }}
            />
            <img
                src={resultImage}
                alt="Result"
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    top: 0,
                    left: 0,
                    clipPath: `polygon(0 0, ${offsetX}px 0, ${offsetX}px 100%, 0 100%)`,
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: `${offsetX}px`,
                    width: '4px',
                    background: 'white',
                    transform: 'translateX(-50%)',
                    zIndex: 2,
                }}
            />
        </div>
    );
};

export default CompareImages;
