import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashParticle {
  id: number;
  x: number;
  y: number;
  scale: number;
}

export default function SyringeCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [splashes, setSplashes] = useState<SplashParticle[]>([]);
  const [scaleFactor, setScaleFactor] = useState(0.35);
  const splashIdCounter = useRef(0);

  // Check if device is fine pointer (has mouse)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Responsive scale
  useEffect(() => {
    const handleResize = () => {
      // 0.25 at 1000px, 0.45 at 1800px (approx 32px height)
      const newScale = Math.max(0.25, Math.min(0.45, window.innerWidth / 4000));
      setScaleFactor(newScale);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track mouse position and custom hover logic
  useEffect(() => {
    if (!isFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Detect clickable elements
      const isClickable = target.closest(
        'button, a, input, select, textarea, [role="button"], .cursor-pointer, [onclick]'
      );
      setIsHovered(!!isClickable);
    };

    const handleMouseDown = () => {
      setIsClicked(true);
      triggerSplash();
    };

    const handleMouseUp = () => {
      setIsClicked(false);
    };

    // Listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Inject styles to hide default cursor
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @media (pointer: fine) {
        html, body, a, button, select, input, textarea, [role="button"], .cursor-pointer {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.head.removeChild(styleEl);
    };
  }, [isFinePointer]);

  // Handle splash particle generation
  const triggerSplash = () => {
    const newParticles: SplashParticle[] = Array.from({ length: 5 }).map(() => {
      const angle = (Math.random() * 60 - 30) - 135; // shoot up-left-ish (opposite of syringe tilt)
      const rad = (angle * Math.PI) / 180;
      const speed = Math.random() * 60 + 40;
      return {
        id: ++splashIdCounter.current,
        x: Math.cos(rad) * speed,
        y: Math.sin(rad) * speed,
        scale: Math.random() * 0.6 + 0.4,
      };
    });

    setSplashes((prev) => [...prev, ...newParticles]);

    // Clean up particles
    setTimeout(() => {
      setSplashes((prev) => prev.slice(newParticles.length));
    }, 600);
  };

  if (!isFinePointer) return null;

  // Center of hotspot in the SVG (50, 5) which represents the needle tip
  const originalHotspotX = 50;
  const originalHotspotY = 5;
  const hotspotX = originalHotspotX * scaleFactor;
  const hotspotY = originalHotspotY * scaleFactor;

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        transform: `translate3d(${position.x - hotspotX}px, ${position.y - hotspotY}px, 0)`,
        pointerEvents: 'none',
        zIndex: 999999,
      }}
    >
      <div style={{ transform: `scale(${scaleFactor})`, transformOrigin: '0 0' }}>
        {/* Splash effect particles emanating from the needle tip */}
        <AnimatePresence>
          {splashes.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: originalHotspotX, y: originalHotspotY, opacity: 1, scale: p.scale }}
              animate={{ x: originalHotspotX + p.x, y: originalHotspotY + p.y, opacity: 0, scale: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute w-2.5 h-2.5 bg-emerald-400 rounded-full blur-[0.5px] shadow-[0_0_8px_#34d399]"
              style={{ originX: 0.5, originY: 0.5 }}
            />
          ))}
        </AnimatePresence>

        {/* Syringe Cursor Visual */}
        <motion.div
          animate={{
            rotate: isHovered ? -22 : -45,
            scale: isClicked ? 0.85 : isHovered ? 1.1 : 1.0,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 24,
          }}
          style={{
            width: '100px',
            height: '120px',
            transformOrigin: `${originalHotspotX}px ${originalHotspotY}px`,
          }}
          className="relative"
        >
          <svg
            width="100"
            height="120"
            viewBox="0 0 100 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          >
            {/* Glowing Aura for Liquid */}
            <circle
              cx="50"
              cy={isClicked ? "40" : "55"}
              r="16"
              className="fill-emerald-500/20 blur-md transition-all duration-150"
            />

            {/* Needle (The sharp tip) */}
            <line
              x1="50"
              y1="5"
              x2="50"
              y2="30"
              stroke="#94A3B8"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Needle Hub / Cap joint */}
            <path
              d="M47 30 L53 30 L54 38 L46 38 Z"
              fill="#64748B"
              stroke="#475569"
              strokeWidth="1"
            />

            {/* Transparent Glass Barrel */}
            <rect
              x="40"
              y="38"
              width="20"
              height="50"
              rx="2"
              fill="rgba(15, 23, 42, 0.6)"
              stroke="#E2E8F0"
              strokeWidth="2"
            />

            {/* Graduation Marks on Barrel */}
            <line x1="42" y1="46" x2="47" y2="46" stroke="#94A3B8" strokeWidth="1" />
            <line x1="42" y1="54" x2="45" y2="54" stroke="#94A3B8" strokeWidth="1" />
            <line x1="42" y1="62" x2="47" y2="62" stroke="#94A3B8" strokeWidth="1" />
            <line x1="42" y1="70" x2="45" y2="70" stroke="#94A3B8" strokeWidth="1" />
            <line x1="42" y1="78" x2="47" y2="78" stroke="#94A3B8" strokeWidth="1" />

            {/* Vaccine Fluid Inside (Dynamic Height based on click state) */}
            <motion.rect
              initial={{ y: 39, height: 26 }}
              animate={{
                y: isClicked ? 39 : 39,
                height: isClicked ? 2 : 26,
              }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              x="41.5"
              width="17"
              fill="#10B981"
              className="opacity-80 shadow-[0_0_8px_#10b981]"
            />

            {/* Plunger Rubber Stopper (Inside the barrel) */}
            <motion.rect
              initial={{ y: 65 }}
              animate={{
                y: isClicked ? 40 : 65,
              }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              x="41.5"
              width="17"
              height="5"
              rx="0.5"
              fill="#1E293B"
              stroke="#0F172A"
              strokeWidth="1"
            />

            {/* Plunger Rod (Extending from the bottom) */}
            <motion.line
              initial={{ y1: 70, y2: 110 }}
              animate={{
                y1: isClicked ? 45 : 70,
                y2: isClicked ? 85 : 110,
              }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              x1="50"
              x2="50"
              stroke="#94A3B8"
              strokeWidth="2.5"
            />

            {/* Thumb Press Cap */}
            <motion.rect
              initial={{ y: 110 }}
              animate={{
                y: isClicked ? 85 : 110,
              }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              x="43"
              width="14"
              height="3"
              rx="1"
              fill="#64748B"
              stroke="#475569"
              strokeWidth="1"
            />

            {/* Barrel Collar / Finger Flanges (Fixed at bottom of barrel) */}
            <rect
              x="32"
              y="88"
              width="36"
              height="4"
              rx="1.5"
              fill="#E2E8F0"
              stroke="#CBD5E1"
              strokeWidth="1"
            />
          </svg>

          {/* Floating hanging droplet when hovered over clickable */}
          <AnimatePresence>
            {isHovered && !isClicked && (
              <motion.div
                initial={{ scale: 0, opacity: 0, y: 0 }}
                animate={{ scale: 1, opacity: 1, y: 2 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.8 }}
                style={{ left: `${originalHotspotX - 2}px`, top: `${originalHotspotY - 2}px` }}
                className="absolute w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_4px_#34d399]"
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
