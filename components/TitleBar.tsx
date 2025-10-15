import React from 'react';
import { ShieldIcon } from './icons/ShieldIcon';

const TitleBar: React.FC = () => {
  return (
    <div className="title-bar bg-gray-800/60 w-full flex items-center justify-center px-4 border-b border-gray-700/50">
      <div className="flex items-center text-sm text-gray-300">
        <ShieldIcon className="w-4 h-4 mr-2 text-blue-400" />
        <span className="font-semibold">Tibbles Source Of Security</span>
      </div>
    </div>
  );
};

export default TitleBar;
