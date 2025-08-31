
import React from 'react';
import { SparklesIcon } from './icons.tsx';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-8 h-8 text-indigo-400" />
            <h1 className="text-xl font-bold tracking-tighter text-gray-100">
              Meme Generator
            </h1>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;