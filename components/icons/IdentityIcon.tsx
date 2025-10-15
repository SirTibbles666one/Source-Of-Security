import React from 'react';

export const IdentityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7.5" r="4.5" />
    <path d="M18 8a5 5 0 0 1 5 5v3" />
    <path d="M20 18v-2a2 2 0 0 0-2-2h-1" />
  </svg>
);
