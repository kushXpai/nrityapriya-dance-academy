import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function GalleryPhotoSection() {
  const [photos, setPhotos] = useState([]);
  const [fullscreenMedia, setFullscreenMedia] = useState(null);
  const [fullscreenType, setFullscreenType] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch photos from Supabase
  useEffect(() => {
    const fetchPhotos = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('photos')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPhotos(data || []);
      } catch (error) {
        console.error('Error fetching photos:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  // Photo navigation handlers
  const handlePrevPhoto = () => {
    setCurrentPhotoIndex(prev => 
      prev === 0 ? photos.length - 1 : prev - 1
    );
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex(prev => 
      prev === photos.length - 1 ? 0 : prev + 1
    );
  };

  const openFullscreenPhoto = (index) => {
    setFullscreenMedia(index);
    setFullscreenType('photo');
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setFullscreenMedia(null);
    setFullscreenType(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section className="py-4 md:py-16 bg-gray-100" id="gallery">
      <div className="max-w-7xl mx-auto px-2 md:px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-8 text-center">
          Photo Gallery
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-t-gray-800 border-r-gray-800 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center text-gray-500">No photos available</div>
        ) : (
          <>
            {/* Desktop View - Grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="relative w-full aspect-[2/3] overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => openFullscreenPhoto(index)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.photo_url}
                    alt={photo.name || 'Gallery photo'}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>

            {/* Mobile View - Compact Slider */}
            <div className="md:hidden">
              {photos.length > 0 && (
                <div className="relative w-full max-h-[70vh]">
                  <div 
                    className="w-full aspect-[2/3] overflow-hidden rounded-lg cursor-pointer"
                    onClick={() => openFullscreenPhoto(currentPhotoIndex)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photos[currentPhotoIndex].photo_url}
                      alt={photos[currentPhotoIndex].name || 'Gallery photo'}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>

                  {/* Navigation Buttons */}
                  <button
                    onClick={handlePrevPhoto}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md hover:bg-white"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextPhoto}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md hover:bg-white"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Image Counter */}
                  <div className="mt-2 text-center text-gray-600 text-sm">
                    {currentPhotoIndex + 1} / {photos.length}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Fullscreen Modal for Photos */}
        {fullscreenType === 'photo' && fullscreenMedia !== null && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onClick={closeFullscreen}
          >
            <div className="relative max-w-4xl max-h-screen p-2 md:p-4">
              <div className="relative max-w-full max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
                <div className="relative w-full h-full flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photos[fullscreenMedia].photo_url}
                    alt={photos[fullscreenMedia].name || 'Fullscreen photo'}
                    className="max-w-full max-h-[85vh] object-contain"
                  />
                </div>
                
                {photos[fullscreenMedia].description && (
                  <div className="bg-black/70 text-white p-2 mt-2 rounded">
                    <h3 className="font-medium">{photos[fullscreenMedia].name}</h3>
                    <p className="text-sm mt-1">{photos[fullscreenMedia].description}</p>
                  </div>
                )}
              </div>
              
              <button 
                className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/70 p-1 md:p-2 rounded-full"
                onClick={closeFullscreen}
              >
                <X size={16} className="md:w-6 md:h-6" />
              </button>
              
              <div className="absolute bottom-2 md:bottom-4 left-0 right-0 flex justify-center gap-2">
                <button 
                  className="bg-white/70 p-1 md:p-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenMedia(prev => prev === 0 ? photos.length - 1 : prev - 1);
                  }}
                >
                  <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                </button>
                <button 
                  className="bg-white/70 p-1 md:p-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenMedia(prev => prev === photos.length - 1 ? 0 : prev + 1);
                  }}
                >
                  <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}