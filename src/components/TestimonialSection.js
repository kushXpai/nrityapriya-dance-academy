import Image from 'next/image'
import { useEffect, useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import StudentImage1 from '../../public/images/Students/Student-1.jpg';
import StudentImage2 from '../../public/images/Students/Student-1.jpg';
import StudentImage3 from '../../public/images/Students/Student-3.jpg';
import StudentImage4 from '../../public/images/Students/Student-4.jpg';
import StudentImage5 from '../../public/images/Students/Student-5.jpg';
import StudentImage6 from '../../public/images/Students/Student-6.jpg';
import StudentImage7 from '../../public/images/Students/Student-7.jpg';
import StudentImage8 from '../../public/images/Students/Student-8.jpg';
// import StudentImage9 from '../../public/images/Students/Student-9.jpg';
// import StudentImage10 from '../../public/images/Students/Student-10.jpg';

export default function TestimonialSection() {

  const [isPaused, setIsPaused] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  const testimonials = [
    {
      name: "Priya Shah",
      role: "Student",
      quote: "Learning Bharatanatyam here has been a transformative experience. The attention to detail and personal guidance is exceptional.",
      image: StudentImage1,
    },
    {
      name: "John Doe",
      role: "Student",
      quote: "The courses provided a great foundation in Kathak and were very well structured. The teachers were supportive and encouraging throughout.",
      image: StudentImage2,
    },
    {
      name: "Amit Kumar",
      role: "Alumnus",
      quote: "Thanks to the training, I was able to perform at a professional level. The guidance I received helped me develop both technically and artistically.",
      image: StudentImage3,
    },
    {
      name: "Neha Gupta",
      role: "Student",
      quote: "A wonderful learning environment with friendly teachers who helped me reach my potential.",
      image: StudentImage4,
    },
    {
      name: "Ravi Singh",
      role: "Alumnus",
      quote: "The journey was truly enriching. It not only improved my dance but also my personal growth.",
      image: StudentImage5,
    },
    {
      name: "Anjali Desai",
      role: "Student",
      quote: "The instructors here not only teach dance but instill a deep love for the art form. I’ve learned so much in a short time!",
      image: StudentImage6,
    },
    {
      name: "Suresh Patel",
      role: "Alumnus",
      quote: "The rigorous training and constant motivation helped me push my boundaries. I’m grateful for this experience.",
      image: StudentImage7,
    },
    {
      name: "Simran Mehta",
      role: "Student",
      quote: "I never thought I could be this skilled! The personalized attention made all the difference in my learning journey.",
      image: StudentImage8,
    },
    // {
    //   name: "Rajesh Reddy",
    //   role: "Alumnus",
    //   quote: "I gained confidence in my abilities and developed a strong foundation in classical dance that has helped me in my professional life.",
    //   image: StudentImage9,
    // },
    // {
    //   name: "Kiran Joshi",
    //   role: "Student",
    //   quote: "The atmosphere here is so nurturing. I’ve improved a lot, and the teachers are always encouraging me to do better.",
    //   image: StudentImage10,
    // },
  ];

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

  // Track if the component has mounted (to avoid SSR errors)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Dynamically calculate the number of visible testimonials only when the component is mounted
  useEffect(() => {
    if (isMounted) {
      const updateVisibleCount = () => {
        if (window.innerWidth >= 1024) {
          setVisibleCount(3);
        } else if (window.innerWidth >= 768) {
          setVisibleCount(2);
        } else {
          setVisibleCount(1);
        }
      };

      updateVisibleCount(); // Set initial value on mount
      window.addEventListener("resize", updateVisibleCount); // Update on resize

      return () => {
        window.removeEventListener("resize", updateVisibleCount); // Cleanup on unmount
      };
    }
  }, [isMounted]);

  const getVisibleTestimonials = () => {
    const items = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentSlide + i) % testimonials.length;
      items.push(testimonials[index]);
    }
    return items;
  };

  return (
    <section className="py-16 bg-gray-50" id="testimonials">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">What Our Students Say</h2>

        <div className="relative">
          <div className="flex items-center">
            <button 
              onClick={handlePrev}
              className="hidden md:flex transform -translate-x-4 bg-white h-12 w-12 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shrink-0 z-10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>

            <div 
              className="w-full"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getVisibleTestimonials().map((testimonial, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl border border-gray-100"
                  >
                    <div className="flex items-center mb-4">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                      />
                      <div className="ml-4">
                        <p className="text-lg font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      <span className="text-3xl text-gray-400 font-serif">&ldquo;</span>
                      {testimonial.quote}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={handleNext}
              className="hidden md:flex transform translate-x-4 bg-white h-12 w-12 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shrink-0 z-10"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>

          <div className="flex justify-between md:hidden mt-6">
            <button 
              onClick={handlePrev}
              className="bg-white h-10 w-10 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>

            <button 
              onClick={handleNext}
              className="bg-white h-10 w-10 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </div>

          <div className="flex justify-center mt-6 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-gray-800 w-8 h-2' 
                    : 'bg-gray-300 w-2 h-2'
                } rounded-full`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}