import React from 'react';

export const MobileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="7" y="2" width="10" height="20" rx="2" ry="2"></rect>
        <path d="M12 18h.01" />
        <path d="M10 4s-2 1.5-2 4 2 4 2 4" />
        <path d="M14 4s2 1.5 2 4-2 4-2 4" />
    </svg>
);