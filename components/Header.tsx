import React from 'react';
import { SparklesIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="py-4 px-4 lg:px-8">
      <div className="container mx-auto flex items-center gap-3">
        <SparklesIcon className="w-8 h-8 text-indigo-400" />
        <h1 className="text-2xl font-bold tracking-tighter text-gray-100">
          Meme Generator
        </h1>
      </div>
    </header>
  );
};

export default Header;