import React from 'react';

interface AethelgardLogoProps {
  className?: string;
  isDay?: boolean;
  style?: React.CSSProperties;
}

export const AethelgardLogo: React.FC<AethelgardLogoProps> = ({ className, isDay, style }) => {
  return (
    <svg 
      width="60" 
      height="60" 
      viewBox="0 0 60 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Stylized Serif 'A' Monogram */}
      <path 
        d="M30 10L15 45H20L30 18L40 45H45L30 10Z" 
        fill="currentColor" 
      />
      <path 
        d="M22 35H38" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      
      {/* Botanical Element: Oak Leaf / River Curve */}
      <path 
        d="M45 45C50 40 50 30 40 25C35 22 25 25 20 30C15 35 15 45 25 45" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        fill="none"
      />
      <path 
        d="M42 32C44 30 44 26 41 24C38 22 34 24 33 27C32 30 34 34 38 35C42 36 45 32 42 32Z" 
        fill="currentColor" 
        fillOpacity="0.3"
      />
      
      {/* Flourish Detail */}
      <circle cx="30" cy="10" r="1.5" fill="currentColor"/>
    </svg>
  );
};
