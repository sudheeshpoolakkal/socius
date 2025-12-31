import React, { useState } from 'react';

/**
 * OptimizedImage - A performance-optimized image component
 * Features:
 * - Skeleton placeholder while loading
 * - Smooth fade-in animation on load
 * - Error fallback handling
 * - Priority loading support for critical images
 */
const OptimizedImage = ({
    src,
    alt,
    className = '',
    containerClassName = '',
    fallbackSrc = 'https://placehold.co/400x400/f3f4f6/9ca3af?text=Image',
    priority = false,
    aspectRatio = 'square', // 'square', 'video', 'portrait', or custom like '3/4'
    objectFit = 'cover',
    objectPosition = 'center',
    onLoad: externalOnLoad,
    onError: externalOnError,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const aspectRatioClasses = {
        square: 'aspect-square',
        video: 'aspect-video',
        portrait: 'aspect-[3/4]',
    };

    const handleLoad = (e) => {
        setIsLoaded(true);
        externalOnLoad?.(e);
    };

    const handleError = (e) => {
        setHasError(true);
        setIsLoaded(true);
        if (fallbackSrc && e.target.src !== fallbackSrc) {
            e.target.src = fallbackSrc;
        }
        externalOnError?.(e);
    };

    const aspectRatioClass = aspectRatioClasses[aspectRatio] || `aspect-[${aspectRatio}]`;

    return (
        <div className={`relative overflow-hidden ${aspectRatioClass} ${containerClassName}`}>
            {/* Skeleton placeholder */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse">
                    <div className="absolute inset-0 skeleton-shimmer" />
                </div>
            )}

            {/* Actual image */}
            <img
                src={hasError ? fallbackSrc : src}
                alt={alt}
                className={`
          w-full h-full
          object-${objectFit}
          transition-opacity duration-300 ease-in-out
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${className}
        `}
                style={{ objectPosition }}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                fetchpriority={priority ? 'high' : 'auto'}
                onLoad={handleLoad}
                onError={handleError}
                {...props}
            />
        </div>
    );
};

export default OptimizedImage;
