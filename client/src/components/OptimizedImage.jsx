import React, { useState, useRef, useEffect } from 'react';

const imgUrl = (path) => {
  if (!path) return null;
  const url = path.startsWith('http') ? path : `https://dude-s-kitchen-server.onrender.com${path}`;
  if (url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', '/upload/q_auto,f_auto,w_800/');
  }
  return url;
};

const imgSrcSet = (path) => {
  if (!path) return null;
  const url = path.startsWith('http') ? path : `https://dude-s-kitchen-server.onrender.com${path}`;
  if (url.includes('res.cloudinary.com')) {
    const base = url.replace('/upload/', '/upload/');
    return `${base.replace('/upload/', '/upload/q_auto,f_auto,w_400/')} 400w, ${base.replace('/upload/', '/upload/q_auto,f_auto,w_800/')} 800w`;
  }
  return null;
};

export default function OptimizedImage({ src, alt, className = '', width, height, style = {}, fetchPriority, onClick }) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef(null);
  const isAboveFold = fetchPriority === 'high';

  useEffect(() => {
    if (isAboveFold) {
      setInView(true);
      return;
    }
    const el = imgRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isAboveFold]);

  const resolvedSrc = imgUrl(src);
  const resolvedSrcSet = imgSrcSet(src);

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ ...(width ? { width } : {}), ...(height ? { height } : {}), ...style }}
      onClick={onClick}
    >
      {!loaded && (
        <div className="absolute inset-0 skeleton-pulse" />
      )}
      {resolvedSrc && inView && (
        <img
          src={resolvedSrc}
          srcSet={resolvedSrcSet}
          sizes="(max-width: 400px) 400px, 800px"
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          fetchpriority={fetchPriority}
          decoding="async"
        />
      )}
      {resolvedSrc && inView && width && height && (
        <div style={{ paddingBottom: `${(height / width) * 100}%` }} />
      )}
    </div>
  );
}

export { imgUrl, imgSrcSet };
