import React, { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";
import { Play, ChevronLeft, ChevronRight, X } from 'lucide-react';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function GalleryVideoSection() {
  const [videos, setVideos] = useState([]);
  const [fullscreenMedia, setFullscreenMedia] = useState(null);
  const [fullscreenType, setFullscreenType] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch videos from Supabase
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        // Log the request to verify
        console.log('Fetching videos from Supabase');
        
        const { data, error } = await supabase
          .from("videos")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        
        // Log the raw response to see its structure
        console.log('Raw Supabase response:', data);
        
        if (!Array.isArray(data)) {
          console.error('Supabase did not return an array:', data);
          setError('Unexpected response format');
          setLoading(false);
          return;
        }
        
        // Process videos similar to admin side
        const processedVideos = data.map(video => ({
          public_id: video.id,
          name: video.name || 'Untitled Video',
          description: video.description || '',
          thumbnailUrl: video.thumbnail_url || '/placeholder-thumbnail.jpg',
          secure_url: video.video_url,
          width: video.width || 1280,
          height: video.height || 720
        }));
        
        console.log('Processed videos:', processedVideos);
        setVideos(processedVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
        
        // More detailed error logging
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
          setError(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
        } else {
          console.error('Error message:', error.message);
          setError(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
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
    setCurrentVideoIndex(index);
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

  if (loading) {
    return (
      <section className="py-16 bg-gray-100" id="video-gallery">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Video Gallery
          </h2>
          <div className="text-center text-gray-500">Loading videos...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-100" id="video-gallery">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Video Gallery
          </h2>
          <div className="text-center text-red-500">{error}</div>
        </div>
      </section>
    );
  }

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
            {/* Responsive Grid View for Videos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                    key={videos[fullscreenMedia].public_id}
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

              {/* Video Details */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-4">
                <div className="text-center text-white flex-grow mx-4">
                  <h3 className="text-xl font-bold">{videos[fullscreenMedia]?.name}</h3>
                  <p className="text-sm">{videos[fullscreenMedia]?.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}