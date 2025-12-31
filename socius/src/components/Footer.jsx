import React from 'react';
import { Link } from 'react-router-dom';

const footerSections = [
  {
    title: 'Platform',
    links: [
      { name: 'Inventory', path: '/inventory' },
      { name: 'Community', path: '/community' },
      { name: 'About Us', path: '/about' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', path: '/help' },
      { name: 'Safety & Trust', path: '/safety' },
      { name: 'Contact Us', path: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
    ],
  },
];

const baseLinkStyle = 'text-sm transition-colors duration-200';
const standardLinkStyle = `${baseLinkStyle} text-gray-400 hover:text-white`;

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-white tracking-wide">Socius</h3>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Digitizing neighborly borrowing for sustainable access to everyday goods.
              Hyperlocal, trust-based, and community-driven.
            </p>
            <div className="flex gap-4 pt-2">
              {/* Social Placeholders - keeping it clean */}
              <div className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer"></div>
            </div>
          </div>

          {/* Dynamically Generated Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className={standardLinkStyle}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            Copyright © {new Date().getFullYear()} Socius. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;