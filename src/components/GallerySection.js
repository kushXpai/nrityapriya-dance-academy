import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';

import GalleryImage1 from '/public/images/Gallery/Image-1.jpeg';
import GalleryImage2 from '/public/images/Gallery/Image-2.jpeg';
import GalleryImage3 from '/public/images/Gallery/Image-3.jpeg';
import GalleryImage4 from '/public/images/Gallery/Image-4.jpeg';
import ThumbnailImage1 from '/public/images/Gallery/Video-1-Thumbnail.png';
import ThumbnailImage2 from '/public/images/Gallery/Video-2-Thumbnail.png';
import ThumbnailImage3 from '/public/images/Gallery/Video-3-Thumbnail.png';
import ThumbnailImage4 from '/public/images/Gallery/Video-4-Thumbnail.png';
import ThumbnailImage5 from '/public/images/Gallery/Video-5-Thumbnail.png';
// Remove direct video imports

export default function GallerySection() {
  const [fullscreenMedia, setFullscreenMedia] = useState(null);
  const [fullscreenType, setFullscreenType] = useState(null); // 'photo' or 'video'
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Fixed dimensions for each orientation
  const dimensions = {
    portrait: {
      aspectRatio: '2/3',
      paddingBottom: '150%',
    },
    landscape: {
      aspectRatio: '3/2',
      paddingBottom: '66.67%',
    }
  };

  // Photo items (all portrait)
  const photoItems = [
    { 
      src: GalleryImage1,
      alt: 'Students performing Kathak dance'
    },
    { 
      src: GalleryImage2, 
      alt: 'Dance classroom session'
    },
    { 
      src: GalleryImage3,
      alt: 'Group of students in traditional attire'
    },
    { 
      src: GalleryImage4,
      alt: 'Solo dance performance'
    }
  ];

  // Video items (all landscape) - Use paths instead of imports
  const videoItems = [
    {
      thumbnail: ThumbnailImage1, // Use actual thumbnail images in production
      videoSrc: '/images/Gallery/Video-1.mp4', // Path relative to public folder
      alt: 'Kathak performance video 1'
    },
    {
      thumbnail: ThumbnailImage2,
      videoSrc: '/images/Gallery/Video-2.mp4',
      alt: 'Kathak performance video 2'
    },
    {
      thumbnail: ThumbnailImage3,
      videoSrc: '/images/Gallery/Video-3.mp4',
      alt: 'Kathak performance video 3'
    },
    {
      thumbnail: ThumbnailImage4,
      videoSrc: '/images/Gallery/Video-4.mp4',
      alt: 'Kathak performance video 4'
    },
    {
      thumbnail: ThumbnailImage5,
      videoSrc: '/images/Gallery/Video-5.mp4',
      alt: 'Kathak performance video 5'
    }
  ];

  // Photo navigation handlers
  const handlePrevPhoto = () => {
    setCurrentPhotoIndex(prev => 
      prev === 0 ? photoItems.length - 1 : prev - 1
    );
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex(prev => 
      prev === photoItems.length - 1 ? 0 : prev + 1
    );
  };

  // Video navigation handlers
  const handlePrevVideo = () => {
    setCurrentVideoIndex(prev => 
      prev === 0 ? videoItems.length - 1 : prev - 1
    );
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex(prev => 
      prev === videoItems.length - 1 ? 0 : prev + 1
    );
  };

  const openFullscreenPhoto = (index) => {
    setFullscreenMedia(index);
    setFullscreenType('photo');
    document.body.style.overflow = 'hidden';
  };

  const openFullscreenVideo = (index) => {
    setFullscreenMedia(index);
    setFullscreenType('video');
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setFullscreenMedia(null);
    setFullscreenType(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section className="py-16 bg-gray-100" id="gallery">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Photo & Video Gallery
        </h2>

        {/* Photos Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Photos</h3>
          
          {/* Desktop & Tablet Grid View for Photos */}
          <div className="hidden md:grid grid-cols-4 gap-4 auto-rows-auto">
            {photoItems.map((item, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg cursor-pointer relative"
                onClick={() => openFullscreenPhoto(index)}
              >
                <div 
                  className="relative" 
                  style={{ 
                    paddingBottom: dimensions.portrait.paddingBottom,
                    aspectRatio: dimensions.portrait.aspectRatio
                  }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View (Single Column Slider) for Photos */}
          <div className="block md:hidden">
            <div className="relative">
              <div 
                className="overflow-hidden rounded-lg relative" 
                style={{ 
                  paddingBottom: dimensions.portrait.paddingBottom,
                  aspectRatio: dimensions.portrait.aspectRatio
                }}
              >
                <Image
                  src={photoItems[currentPhotoIndex].src}
                  alt={photoItems[currentPhotoIndex].alt}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={handlePrevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md hover:bg-white"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md hover:bg-white"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Image Counter */}
            <div className="mt-4 text-center text-gray-600">
              {currentPhotoIndex + 1} / {photoItems.length}
            </div>
          </div>
        </div>

        {/* Videos Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Videos</h3>
          
          {/* Desktop & Tablet Grid View for Videos */}
          <div className="hidden md:grid grid-cols-2 gap-6 auto-rows-auto">
            {videoItems.map((item, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg cursor-pointer relative"
                onClick={() => openFullscreenVideo(index)}
              >
                <div 
                  className="relative" 
                  style={{ 
                    paddingBottom: dimensions.landscape.paddingBottom,
                    aspectRatio: dimensions.landscape.aspectRatio
                  }}
                >
                  <div className="absolute inset-0 w-full h-full group">
                    <Image 
                      src={item.thumbnail}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all">
                      <div className="bg-white bg-opacity-80 rounded-full p-3">
                        <Play size={24} className="text-gray-800" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View (Single Column Slider) for Videos */}
          <div className="block md:hidden">
            <div className="relative">
              <div 
                className="overflow-hidden rounded-lg relative cursor-pointer" 
                style={{ 
                  paddingBottom: dimensions.landscape.paddingBottom,
                  aspectRatio: dimensions.landscape.aspectRatio
                }}
                onClick={() => openFullscreenVideo(currentVideoIndex)} // Add click handler here
              >
                <div className="absolute inset-0 w-full h-full">
                  <Image 
                    src={videoItems[currentVideoIndex].thumbnail}
                    alt={videoItems[currentVideoIndex].alt}
                    fill
                    className="object-cover" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white bg-opacity-80 rounded-full p-3">
                      <Play size={24} className="text-gray-800" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent video from opening when navigation buttons are clicked
                  handlePrevVideo();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md hover:bg-white z-10"
                aria-label="Previous video"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent video from opening when navigation buttons are clicked
                  handleNextVideo();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md hover:bg-white z-10"
                aria-label="Next video"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Video Counter */}
            <div className="mt-4 text-center text-gray-600">
              {currentVideoIndex + 1} / {videoItems.length}
            </div>
          </div>
        </div>

        {/* Fullscreen Modal for Photos */}
        {fullscreenType === 'photo' && fullscreenMedia !== null && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onClick={closeFullscreen}
          >
            <div className="relative max-w-4xl max-h-screen p-4">
              <div className="relative max-w-full max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
                <Image
                  src={photoItems[fullscreenMedia].src}
                  alt={photoItems[fullscreenMedia].alt}
                  width={800}
                  height={1200}
                  className="max-w-full max-h-[85vh] object-contain"
                />
              </div>
              
              <button 
                className="absolute top-4 right-4 bg-white/70 p-2 rounded-full"
                onClick={closeFullscreen}
              >
                <X size={24} />
              </button>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                <button 
                  className="bg-white/70 p-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenMedia(prev => prev === 0 ? photoItems.length - 1 : prev - 1);
                  }}
                >
                  <ChevronLeft />
                </button>
                <button 
                  className="bg-white/70 p-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenMedia(prev => prev === photoItems.length - 1 ? 0 : prev + 1);
                  }}
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen Modal for Videos */}
        {fullscreenType === 'video' && fullscreenMedia !== null && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onClick={closeFullscreen}
          >
            <div className="relative max-w-4xl max-h-screen p-4">
              <div className="aspect-video w-full max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
                <video 
                  controls 
                  className="w-full h-full object-contain"
                  autoPlay
                  playsInline // Add for better mobile compatibility
                >
                  <source src={videoItems[fullscreenMedia].videoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <button 
                className="absolute top-4 right-4 bg-white/70 p-2 rounded-full"
                onClick={closeFullscreen}
              >
                <X size={24} />
              </button>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                <button 
                  className="bg-white/70 p-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenMedia(prev => prev === 0 ? videoItems.length - 1 : prev - 1);
                  }}
                >
                  <ChevronLeft />
                </button>
                <button 
                  className="bg-white/70 p-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenMedia(prev => prev === videoItems.length - 1 ? 0 : prev + 1);
                  }}
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}