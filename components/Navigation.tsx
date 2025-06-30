import React, { useState } from 'react';
import Link from 'next/link';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-sm">DS</span>
            </div>
            <span className="text-xl font-bold gradient-text">DeepShield AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-accent transition-colors duration-300">
              Home
            </Link>
            <Link href="/analyze" className="text-gray-300 hover:text-accent transition-colors duration-300">
              Analyze
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-accent transition-colors duration-300">
              About
            </Link>
            <Link href="/analyze">
              <button className="btn-primary text-sm px-4 py-2">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-accent transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-300 hover:text-accent transition-colors duration-300">
                Home
              </Link>
              <Link href="/analyze" className="text-gray-300 hover:text-accent transition-colors duration-300">
                Analyze
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-accent transition-colors duration-300">
                About
              </Link>
              <Link href="/analyze">
                <button className="btn-primary text-sm px-4 py-2 w-full">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 