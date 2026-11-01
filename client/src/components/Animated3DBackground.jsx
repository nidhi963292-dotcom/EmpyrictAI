import React from 'react';

export const Animated3DBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Floating 3D Oceanic Teal Sphere */}
      <div className="floating-orb-1 top-[-10%] left-[-5%] w-[550px] h-[550px] opacity-40 dark:opacity-30" />

      {/* Floating 3D Warm Peach Clay Sphere */}
      <div className="floating-orb-2 bottom-[-10%] right-[-5%] w-[600px] h-[600px] opacity-35 dark:opacity-25" />

      {/* Center Subtle Mist Sphere */}
      <div
        className="absolute top-[40%] left-[30%] w-[450px] h-[450px] rounded-full blur-3xl opacity-25 dark:opacity-20 animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(141, 184, 190, 0.25) 0%, rgba(248, 239, 224, 0.05) 70%)'
        }}
      />

      {/* Subtle Noise / Grid Texture */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] bg-[radial-gradient(#1d6e77_1px,transparent_1px)] [background-size:24px_24px]" />
    </div>
  );
};
