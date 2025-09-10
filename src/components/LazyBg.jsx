import React, { useEffect, useRef, useState } from 'react';

// Lazy loads a background image with a blur-up fade-in effect
export default function LazyBg({
  src,
  className,
  style,
  placeholderColor = '#eee',
  children,
  onClick,
}) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const [bg, setBg] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!src) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
          }
        });
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  useEffect(() => {
    if (!inView || !src) return;
    const img = new Image();
    img.src = src;
    const handleLoad = () => {
      setBg(`url(${src})`);
      setLoaded(true);
    };
    img.addEventListener('load', handleLoad);
    img.addEventListener('error', () => setLoaded(true));
    return () => {
      img.removeEventListener('load', handleLoad);
    };
  }, [inView, src]);

  const mergedStyle = {
    backgroundImage: bg,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transition: 'filter 320ms ease, opacity 320ms ease',
    filter: loaded ? 'blur(0px)' : 'blur(16px)',
    opacity: loaded ? 1 : 0.9,
    backgroundColor: placeholderColor,
    ...style,
  };

  return (
    <div ref={ref} className={className} style={mergedStyle} onClick={onClick}>
      {children}
    </div>
  );
}

