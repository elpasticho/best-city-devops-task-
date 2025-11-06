import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Properties', href: '/properties' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <nav className="bg-white dark:bg-secondary-800 shadow-sm">
      <div className="container">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Building icon with modern design */}
                  <rect x="8" y="15" width="8" height="20" fill="#0d9488" opacity="0.8"/>
                  <rect x="18" y="10" width="8" height="25" fill="#0d9488"/>
                  <rect x="28" y="18" width="8" height="17" fill="#0d9488" opacity="0.6"/>
                  {/* Windows */}
                  <rect x="10" y="18" width="2" height="2" fill="white"/>
                  <rect x="13" y="18" width="2" height="2" fill="white"/>
                  <rect x="10" y="22" width="2" height="2" fill="white"/>
                  <rect x="13" y="22" width="2" height="2" fill="white"/>
                  <rect x="20" y="14" width="2" height="2" fill="white"/>
                  <rect x="23" y="14" width="2" height="2" fill="white"/>
                  <rect x="20" y="18" width="2" height="2" fill="white"/>
                  <rect x="23" y="18" width="2" height="2" fill="white"/>
                  <rect x="30" y="22" width="2" height="2" fill="white"/>
                  <rect x="33" y="22" width="2" height="2" fill="white"/>
              </svg>
              <span className="text-2xl font-bold icon-primary mt-1.5">BestCity</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} className="nav-link">
                {item.name}
              </Link>
            ))}
            <button className="btn">Connect</button>
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="text-body hover:text-primary-600 dark:hover:text-primary-400"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block nav-link hover:bg-primary-50 dark:hover:bg-secondary-700"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <button
                className="block w-full text-left px-3 py-2 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
                onClick={() => setIsOpen(false)}
              >
                Connect
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;