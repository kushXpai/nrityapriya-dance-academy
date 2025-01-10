import Image from 'next/image'
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import GalleryImage1 from '/public/images/Gallery/Gallery-1.jpg';
import GalleryImage2 from '/public/images/Gallery/Gallery-2.jpg';
import GalleryImage3 from '/public/images/Gallery/Gallery-3.jpg';
import GalleryImage4 from '/public/images/Gallery/Gallery-4.jpg';
import GalleryImage5 from '/public/images/Gallery/Gallery-5.jpg';
import GalleryImage6 from '/public/images/Gallery/Gallery-6.jpg';

export default function GallerySection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    GalleryImage1,
    GalleryImage2,
    GalleryImage3,
    GalleryImage4,
    GalleryImage5,
    GalleryImage6,
  ];

  return (
    <section className="py-16 bg-gray-100" id="gallery">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Photo & Video Gallery
        </h2>

        {/* Desktop View (3 columns) */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {images.map((src, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg"
              style={{ paddingBottom: '150%' }}
            >
              <Image
                src={src}
                alt={`Gallery ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
                unoptimized={true}
              />
            </div>
          ))}
        </div>

        {/* Tablet View (2 columns) */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-5">
          {images.map((src, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg"
              style={{ paddingBottom: '150%' }}
            >
              <Image
                src={src}
                alt={`Gallery ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
                unoptimized={true}
              />
            </div>
          ))}
        </div>

        {/* Mobile View (Single Column Slider) */}
        <div className="block md:hidden">
          <div className="relative">
            <div className="overflow-hidden rounded-lg" style={{ paddingBottom: '150%' }}>
              <Image
                src={images[currentImageIndex]}
                alt={`Gallery ${currentImageIndex + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                unoptimized={true}
              />
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md hover:bg-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md hover:bg-white"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Image Counter */}
          <div className="mt-4 text-center text-gray-600">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </section>
  );
}