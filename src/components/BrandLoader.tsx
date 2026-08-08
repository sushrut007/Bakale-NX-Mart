import React from 'react';

export default function BrandLoader({ className = "", size = 24 }: { className?: string, size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-spin ${className}`}
    >
      {/* Charcoal diamond */}
      <path d="M12 4 L20 12 L12 20 L4 12 Z" stroke="#333333" strokeWidth="1.5" />
      
      {/* Red arrowheads pointing outwards */}
      <path d="M12 1 L14.5 5 L9.5 5 Z" fill="var(--accent)" />
      <path d="M12 23 L14.5 19 L9.5 19 Z" fill="var(--accent)" />
      <path d="M23 12 L19 9.5 L19 14.5 Z" fill="var(--accent)" />
      <path d="M1 12 L5 9.5 L5 14.5 Z" fill="var(--accent)" />
    </svg>
  );
}
