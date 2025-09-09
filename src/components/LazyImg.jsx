import React from 'react';

export default function LazyImg({ src, alt = '', className, style, onClick, onLoad, sizes, width, height }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
      sizes={sizes}
      width={width}
      height={height}
      onClick={onClick}
      onLoad={onLoad}
    />
  );
}

