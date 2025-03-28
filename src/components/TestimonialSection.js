import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(1);

  // Update visible testimonials count based on screen size
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(3);
      } else if (window.innerWidth >= 768) {
        setVisibleCount(2);
      } else {
        setVisibleCount(1);
      }
    };

    // Initial setup
    updateVisibleCount();

    // Add event listener for window resize
    window.addEventListener('resize', updateVisibleCount);

    // Cleanup listener
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  // Fetch published testimonials from Firestore
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const testimonialsCollection = collection(db, 'testimonials');
        const publishedQuery = query(testimonialsCollection, where('status', '==', 'Published'));
        const testimonialsSnapshot = await getDocs(publishedQuery);
        
        const testimonialsList = testimonialsSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          role: doc.data().role,
          quote: doc.data().testimonial
        }));
        
        setTestimonials(testimonialsList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Get visible testimonials based on current index and visible count
  const getVisibleTestimonials = () => {
    const startIndex = activeIndex * visibleCount;
    return testimonials.slice(startIndex, startIndex + visibleCount);
  };

  // Calculate total pages
  const totalPages = Math.ceil(testimonials.length / visibleCount);

  // Handle navigation
  const handleNext = () => {
    setActiveIndex((prevIndex) => 
      (prevIndex + 1) % totalPages
    );
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? totalPages - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>Loading testimonials...</p>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50" id="testimonials">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">What Our Students Say</h2>
        
        <div className="relative">
          {/* Navigation Buttons for Large Screens */}
          <button 
            onClick={handlePrev} 
            className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/50 rounded-full p-2 hover:bg-white/75 transition"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button 
            onClick={handleNext} 
            className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/50 rounded-full p-2 hover:bg-white/75 transition"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Testimonial Cards Container */}
          <div className="flex justify-center space-x-4">
            {getVisibleTestimonials().map((testimonial) => (
              <div 
                key={testimonial.id}
                className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl border border-gray-100 min-h-[350px] flex flex-col relative"
              >
                <Quote className="absolute top-4 left-4 text-gray-200 w-12 h-12" />
                <p className="text-gray-700 leading-relaxed text-base flex-grow mb-6 relative z-10 italic">
                  {testimonial.quote}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <p className="text-lg font-bold text-gray-900 mb-1">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  activeIndex === index ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}