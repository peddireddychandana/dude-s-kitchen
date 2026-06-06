import React, { useState } from 'react';

const imgUrl = (path, cldWidth = 800) => {
  if (!path) return null;
  const url = path.startsWith('http') ? path : `https://dude-s-kitchen-server.onrender.com${path}`;
  if (url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', `/upload/q_auto,f_auto,w_${cldWidth}/`);
  }
  return url;
};

const imgSrcSet = (path, cldWidth = 800) => {
  if (!path) return null;
  const url = path.startsWith('http') ? path : `https://dude-s-kitchen-server.onrender.com${path}`;
  if (url.includes('res.cloudinary.com')) {
    const half = Math.round(cldWidth * 0.5);
    return `${url.replace('/upload/', `/upload/q_auto,f_auto,w_${half}/`)} ${half}w, ${url.replace('/upload/', `/upload/q_auto,f_auto,w_${cldWidth}/`)} ${cldWidth}w`;
  }
  return null;
};

export default function OptimizedImage({ src, alt, className = '', width, height, style = {}, fetchPriority, onClick }) {
  const [loaded, setLoaded] = useState(false);

  const cldWidth = width ? width * 2 : 800;
  const resolvedSrc = imgUrl(src, cldWidth);
  const resolvedSrcSet = imgSrcSet(src, cldWidth);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ ...(width ? { width } : {}), ...(height ? { height } : {}), ...style }}
      onClick={onClick}
    >
      {!loaded && (
        <div className="absolute inset-0 skeleton-pulse" />
      )}
      {resolvedSrc && (
        <img
          src={resolvedSrc}
          srcSet={resolvedSrcSet}
          sizes={width ? `${width}px` : '(max-width: 400px) 400px, 800px'}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          fetchpriority={fetchPriority}
          decoding="async"
        />
      )}
      {resolvedSrc && width && height && (
        <div style={{ paddingBottom: `${(height / width) * 100}%` }} />
      )}
    </div>
  );
}

export { imgUrl, imgSrcSet };
