import { useEffect, useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TestimonialSection() {

  const [isPaused, setIsPaused] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  const testimonials = [
    {
      name: "Krishna Parajia",
      role: "Student",
      quote: "As a 1st year student of Kathak, my journey has been amazing. Under the expert guidance of my guru, Priyanka Maam, I have developed a deeper understanding of the art form, and their patient teaching style has inspired me to push my boundaries.I am excited to continue growing and learning, and I am grateful for their mentorship and encouragement in this beautiful journey of Kathak boundaries.I am excited to continue growing and learning, and I am grateful for their mentorship and encouragement in this beautiful journey of Kathak."
    },
    {
      name: "Pooja",
      role: "Nyraa's Mother",
      quote: "I wanted to take a moment to express my heartfelt gratitude for the incredible impact you've had on Nyraa's Kathak journey. Since April 2023, this experience has been truly transformational for her. Your patience, commitment, knowledge, and vast experience in Kathak are beyond commendable. It's clear that you pour your heart into teaching, and the depth of your expertise makes all the difference in Nyraa's learning."
    },
    {
      name: "Ruchi Rathod",
      role: "Student",
      quote: "I am incredibly grateful to have been learning Kathak from Priyanka ma'am for the past few years. She is a patient and supportive teacher who encourages me to push my boundaries while respecting my pace of learning. Her deep knowledge of Kathak is evident in every lesson, and she has a great way of breaking down complex steps into simpler parts. More than just a skilled teacher, she creates a warm and inspiring environment that builds confidence and growth. I feel truly fortunate to be learning from her"
    },
    {
      name: "Anika Dalvi",
      role: "Student",
      quote: "Amongst the things that I like, Kathak tops the list. Am excited about Kathakak at the age of 7 and the last 7 years have been truly enriching. I always look forward to my learning sessions every weekend. It sort of sets me free, free to express and feel. During Covid as well, the Kathak classes continued through online sessions. The commitment of Priyanka Miss to the art form is admirable and I hope to emulate her in every aspect. She is also one of the reason that I started loving Kathak. Every student needs a good Guru, and my Guru is not just graceful in her dance but also in the way she conducts herself with her students. Am excited about Kathak and Looking forward to the journey. "
    },
    {
      name: "Snehal Gamare",
      role: "Alumnus",
      quote: "Learning Kathak over the past two years has been an incredibly enriching experience for me. The grace, rhythm, and storytelling aspects of this classical dance have deepened my appreciation for the art form. Each class challenges me to improve, whether it's mastering footwork, hand gestures, or expressions. The supportive learning environment has boosted my confidence and discipline. Kathak has truly become a passion, and I look forward to every session.  Priyanka ma'am is an inspiring mentor, patiently guiding us with dedication and expertise. Her passion for Kathak is contagious, making every class a joyful and transformative experience. "
    },
    {
      name: "Hemangi",
      role: "Nirmayi's Mother",
      quote: "My daughter has truly blossomed since she started learning Kathak. She has developed a deep appreciation for the art, along with improved confidence and discipline. The classes are engaging, and she looks forward to each session with excitement. Her footwork, expressions, and grace have improved tremendously. Watching her perform with such joy makes us so proud. Priyanka ma'am's dedication, and passion for Kathak is truly commendable. She creates a nurturing environment that encourages every child to excel."
    },
    {
      name: "Kinjal Shah",
      role: "Swara's Mother",
      quote: "Firstly i would like to wholeheartedly thank Priyanka mam..my daughter started her training for Kathak with NrityaPriya school of dance almost 3 years back. I was reluctant initially as my daughter was about 5.5 years old. But she was very patient with her. But i must say Priyanka mam is vey sincere and passionate about her work.I have only one thing to say that I am very happy that I enrolled my daughter for Kathak with Priyanka mam..Thank you"
    },
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
                    <div className="mb-4">
                      <div>
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