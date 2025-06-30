import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background-secondary py-8 mt-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © 2025 DeepShield AI. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link href="/about" className="text-gray-400 hover:text-accent transition-colors duration-300">
              About
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-accent transition-colors duration-300">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-accent transition-colors duration-300">
              Terms
            </Link>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-xs">
            Powered by advanced AI models • Built with Next.js & TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 