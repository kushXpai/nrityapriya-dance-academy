import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CldVideo } from 'next-cloudinary';
import { ChevronLeft, ChevronRight, X, Play } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "../../firebase/firebaseConfig";

export default function GalleryVideoSection() {
  const [videos, setVideos] = useState([]);
  const [fullscreenMedia, setFullscreenMedia] = useState(null);
  const [fullscreenType, setFullscreenType] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Consistent video thumbnail dimensions
  const VIDEO_WIDTH = 450;
  const VIDEO_HEIGHT = 300;
  const ASPECT_RATIO = VIDEO_WIDTH / VIDEO_HEIGHT;

  // Fetch videos from Cloudinary and Firestore
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Fetch Cloudinary videos
        const cloudinaryResponse = await axios.get('/api/videos');
        
        // Fetch Firestore metadata to filter out archived videos
        const videosRef = collection(db, 'videos');
        const activeQuery = query(videosRef, where('isArchived', '==', false));
        const querySnapshot = await getDocs(activeQuery);

        const activePublicIds = querySnapshot.docs.map(doc => doc.data().publicId);

        const videosWithMetadata = cloudinaryResponse.data
          .filter(video => activePublicIds.includes(video.public_id))
          .map(video => {
            const metadata = querySnapshot.docs.find(
              doc => doc.data().publicId === video.public_id
            )?.data();

            return {
              ...video,
              name: metadata?.name || video.original_filename,
              description: metadata?.description || '',
              thumbnailUrl: metadata?.thumbnailUrl || video.thumbnail || video.secure_url,
              width: metadata?.width || video.width,
              height: metadata?.height || video.height
            };
          });

        setVideos(videosWithMetadata);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  // Video navigation handlers
  const handlePrevVideo = () => {
    setCurrentVideoIndex(prev => 
      prev === 0 ? videos.length - 1 : prev - 1
    );
    setIsVideoPlaying(false);
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex(prev => 
      prev === videos.length - 1 ? 0 : prev + 1
    );
    setIsVideoPlaying(false);
  };

  const openFullscreenVideo = (index) => {
    setFullscreenMedia(index);
    setFullscreenType('video');
    setIsVideoPlaying(false);
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setFullscreenMedia(null);
    setFullscreenType(null);
    setIsVideoPlaying(false);
    document.body.style.overflow = 'auto';
  };

  const toggleVideoPlay = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  return (
    <section className="py-16 bg-gray-100" id="video-gallery">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Video Gallery
        </h2>

        {videos.length === 0 ? (
          <div className="text-center text-gray-500">No videos available</div>
        ) : (
          <>
            {/* Desktop & Tablet Grid View for Videos */}
            <div className="hidden md:grid grid-cols-2 md:grid-cols-3 gap-4">
              {videos.map((video, index) => (
                <div
                  key={video.public_id}
                  className="relative w-full aspect-[16/9] overflow-hidden rounded-lg cursor-pointer group"
                  onClick={() => openFullscreenVideo(index)}
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.name || 'Gallery video'}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    style={{ 
                      transform: 'rotate(0deg)',
                      objectPosition: 'center'
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile View (Single Column Slider) */}
            <div className="md:hidden mt-8">
              {videos.length > 0 && (
                <div className="relative">
                  <div 
                    className="w-full aspect-[16/9] overflow-hidden rounded-lg"
                    onClick={() => openFullscreenVideo(currentVideoIndex)}
                  >
                    <img
                      src={videos[currentVideoIndex].thumbnailUrl}
                      alt={videos[currentVideoIndex].name || 'Gallery video'}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ 
                        transform: 'rotate(0deg)', 
                        objectPosition: 'center'
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <button
                    onClick={handlePrevVideo}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md hover:bg-white"
                    aria-label="Previous video"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextVideo}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md hover:bg-white"
                    aria-label="Next video"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Video Counter */}
                  <div className="mt-4 text-center text-gray-600">
                    {currentVideoIndex + 1} / {videos.length}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Fullscreen Modal for Videos */}
        {fullscreenType === 'video' && fullscreenMedia !== null && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onClick={closeFullscreen}
          >
            <div className="relative w-full h-full max-w-7xl mx-auto p-4 flex flex-col">
              {/* Close Button */}
              <button 
                className="absolute top-4 right-4 bg-white/70 p-2 rounded-full z-10"
                onClick={closeFullscreen}
              >
                <X size={24} />
              </button>

              {/* Video Container */}
              <div 
                className="flex-grow flex items-center justify-center relative"
                onClick={(e) => e.stopPropagation()}
              >
                {isVideoPlaying ? (
                  <video
                    key={currentVideoIndex}
                    src={videos[fullscreenMedia].secure_url}
                    controls
                    autoPlay
                    className="max-w-full max-h-[85vh] object-contain"
                    style={{
                      transform: 'rotate(0deg)', // Ensure landscape orientation
                      maxWidth: '100%',
                      maxHeight: '85vh'
                    }}
                  />
                ) : (
                  <div className="relative">
                    <img
                      src={videos[fullscreenMedia].thumbnailUrl}
                      alt={videos[fullscreenMedia].name || 'Fullscreen video'}
                      className="max-w-full max-h-[85vh] object-contain"
                      style={{
                        transform: 'rotate(0deg)', // Ensure landscape orientation
                        maxWidth: '100%',
                        maxHeight: '85vh'
                      }}
                    />
                    <button 
                      className="absolute inset-0 flex items-center justify-center"
                      onClick={toggleVideoPlay}
                    >
                      <Play className="w-24 h-24 text-white bg-black/50 rounded-full p-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation and Video Details */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-4">
                {/* Previous Video Button */}
                {/* <button 
                  className="bg-white/70 p-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevVideo();
                  }}
                >
                  <ChevronLeft />
                </button> */}

                {/* Video Details */}
                <div className="text-center text-white flex-grow mx-4">
                  <h3 className="text-xl font-bold">{videos[fullscreenMedia].name}</h3>
                  <p className="text-sm">{videos[fullscreenMedia].description}</p>
                </div>

                {/* Next Video Button */}
                {/* <button 
                  className="bg-white/70 p-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextVideo();
                  }}
                >
                  <ChevronRight />
                </button> */}
              </div>

              {/* Video Counter */}
              {/* <div className="absolute bottom-0 left-0 right-0 text-center text-white pb-2">
                {currentVideoIndex + 1} / {videos.length}
              </div> */}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}