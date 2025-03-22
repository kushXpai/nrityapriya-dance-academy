import Image from 'next/image'
import HeroImage from "/public/images/HeroSection.jpg";

export default function HeroSection() {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative w-full h-screen m-0 p-0 overflow-hidden" id="home">
      {/* Enhanced gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/70 to-black/40 z-10"></div>

      {/* Optimized image loading */}
      <Image
        src={HeroImage}
        alt="Indian Classical Dance Performance"
        className="object-cover w-full h-full"
        loading="eager"
        priority="true"
        unoptimized={true}
      />

      {/* Responsive content container */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-start px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12 z-20">
        <div className="text-white max-w-[90%] md:max-w-[80%] lg:max-w-[70%]">
          {/* Responsive heading with controlled line breaks */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-[#EE3224]">
            NrityaPriya&nbsp;
            <br className="md:hidden" />
            Dance Academy
          </h1>

          {/* Responsive paragraph with controlled line breaks and max width */}
          <p className="mt-4 text-base md:text-lg lg:text-xl font-bold max-w-2xl">
            Discover the Grace of Indian Classical Dance.
            <br className="hidden md:block" />
            Embark on a Journey through centuries-old traditions of
            <br className="hidden md:block" />
            rhythm and expression.
          </p>

          {/* Call to action button - Optional */}
          <button 
            className="mt-8 px-6 py-3 bg-[#EE3224] text-white rounded-lg
                     text-base md:text-lg font-semibold
                     hover:bg-[#ff4433] transition-colors duration-300
                     transform hover:scale-105 active:scale-95"
          >
            Start Your Journey
          </button>
        </div>
      </div>

      {/* Scroll indicator for desktop/tablet */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block z-20">
        <button 
          onClick={scrollToContent}
          className="animate-bounce bg-[#EE3224] p-2 rounded-full 
                   text-white hover:bg-[#ff4433] transition-colors duration-300
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EE3224]"
          aria-label="Scroll to content"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </button>
      </div>
    </section>
  );
}