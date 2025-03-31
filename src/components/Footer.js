import React, { useState, useEffect } from 'react';
import { Instagram, MapPin, Mail, Phone } from 'lucide-react';
import { db } from '../../firebase/firebaseConfig'; // Using your existing Firebase config
import { doc, getDoc } from 'firebase/firestore';

export default function Footer() {
  const [academyData, setAcademyData] = useState({
    address: '',
    email: '',
    phoneNumber: '',
    aboutAcademy: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcademyData = async () => {
      try {
        const profileRef = doc(db, "academyProfiles", "mainProfile");
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists()) {
          const data = profileSnap.data();
          setAcademyData({
            address: data.address || '',
            email: data.email || '',
            phoneNumber: data.phoneNumber || '',
            aboutAcademy: data.aboutAcademy || 'NrityaPriya Dance Academy is dedicated to preserving and promoting the rich tradition of Indian classical dance, with a focus on Kathak and semi-classical dance forms.'
          });
        }
      } catch (error) {
        console.error("Error fetching academy data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAcademyData();
  }, []);

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
    <footer className="bg-[#2A313C] text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-16">
          {/* Academy Info */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              NrityaPriya Dance Academy
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              {academyData.aboutAcademy}
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold mb-6 pb-1 border-b-2 border-[#EE3224] inline-block">
              Contact Us
            </h3>
            <div className="space-y-4 mt-2">
              {academyData.address && (
                <div className="flex items-start gap-3 text-gray-300">
                  <MapPin size={20} className="text-[#EE3224] mt-1 flex-shrink-0" />
                  <span>{academyData.address}</span>
                </div>
              )}
              {academyData.email && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail size={20} className="text-[#EE3224] flex-shrink-0" />
                  <a href={`mailto:${academyData.email}`} className="hover:text-white transition-colors duration-300">
                    {academyData.email}
                  </a>
                </div>
              )}
              {academyData.phoneNumber && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone size={20} className="text-[#EE3224] flex-shrink-0" />
                  <a href={`tel:${academyData.phoneNumber}`} className="hover:text-white transition-colors duration-300">
                    {academyData.phoneNumber}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 pb-1 border-b-2 border-[#EE3224] inline-block">
              Quick Links
            </h3>
            <nav className="mt-2">
              <ul className="space-y-4">
                {['Home', 'About Us', 'Courses', 'Contact Us'].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(' ', '-')}`}
                      onClick={(e) => scrollToSection(e, `#${item.toLowerCase().replace(' ', '-')}`)}
                      className="text-gray-300 hover:text-white transition-colors duration-300"
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

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-2">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} NrityaPriya Dance Academy. All rights reserved.
          </p>
          
          <div>
            <p className="text-sm text-gray-400 mt-3 md:mt-0">
              Preserving and promoting the rich tradition of Indian classical dance.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}