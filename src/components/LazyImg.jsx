import React, { useEffect, useState } from 'react';

// Lazy <img> with blur-up + fade-in
export default function LazyImg({
  src,
  alt = '',
  className,
  style,
  onClick,
  sizes,
  width,
  height,
  placeholderColor = '#eee',
}) {
  const [loaded, setLoaded] = useState(false);
  // If no src yet, keep not-loaded state
  useEffect(() => { setLoaded(false); }, [src]);

  const mergedStyle = {
    transition: 'filter 320ms ease, opacity 320ms ease',
    filter: loaded ? 'blur(0px)' : 'blur(16px)',
    opacity: loaded ? 1 : 0.9,
    backgroundColor: placeholderColor,
    ...style,
  };

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={mergedStyle}
      loading="lazy"
      decoding="async"
      sizes={sizes}
      width={width}
      height={height}
      onClick={onClick}
      onLoad={() => setLoaded(true)}
    />
  );
}
