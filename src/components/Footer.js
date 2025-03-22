import React from 'react';
import { Instagram } from 'lucide-react';

export default function Footer() {
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.querySelector(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-[#2A313C] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Academy Info */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              NrityaPriya Dance Academy
            </h2>
            <p className="text-lg md:text-xl text-gray-300">
              A place to learn, grow, and shine.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col md:flex-row items-center md:items-start md:justify-end">
            <nav>
              <ul className="flex flex-wrap justify-center md:justify-end gap-6 text-base md:text-lg">
                {['Home', 'About Us', 'Courses', 'Contact Us'].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(' ', '-')}`}
                      onClick={(e) => scrollToSection(e, `#${item.toLowerCase().replace(' ', '-')}`)}
                      className="hover:text-[#EE3224] transition-colors duration-300 
                        relative after:content-[''] after:absolute after:w-0 after:h-0.5 
                        after:bg-[#EE3224] after:left-0 after:-bottom-1 after:transition-all 
                        hover:after:w-full"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-700 my-8"></div>

        {/* Copyright and Contact */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} NrityaPriya Dance Academy. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <a 
              href="mailto:nrityapriya.kathak@gmail.com"
              className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
            >
              nrityapriya.kathak@gmail.com
            </a>
            <a
              href="https://instagram.com/nrityapriya_"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-[#EE3224]/10 transition-colors duration-300"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}