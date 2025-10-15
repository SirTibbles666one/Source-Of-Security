import React from 'react';

export const BrowserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="3" width="20" height="18" rx="2" />
    <path d="M2 9h20" />
    <path d="M6 6h.01" />
    <path d="M10 6h.01" />
  </svg>
);