import React from 'react';

export const RouterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="2" y="9" width="20" height="6" rx="2" ry="2"></rect>
        <path d="M7 15v2" />
        <path d="M12 15v2" />
        <path d="M17 15v2" />
        <path d="M9 9V7a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v2" />
    </svg>
);