import React from 'react';

export const WebcamIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
    <line x1="7" y1="2" x2="7" y2="5" />
    <line x1="17" y1="2" x2="17" y2="5" />
    <line x1="2" y1="7" x2="5" y2="7" />
    <line x1="2" y1="17" x2="5" y2="17" />
    <line x1="19" y1="7" x2="22" y2="7" />
    <line x1="19" y1="17" x2="22"y2="17" />
    <line x1="7" y1="22" x2="7" y2="19" />
    <line x1="17" y1="22" x2="17" y2="19" />
  </svg>
);