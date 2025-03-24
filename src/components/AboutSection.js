import Image from 'next/image'
import { Instagram } from 'lucide-react';
import TeacherImage from '/public/images/Teacher.jpeg';

export default function AboutSection() {

  const currentYear = new Date().getFullYear();
  const teachingStartYear = 2017;
  const dancingStartYear = 2005;

  const teachingExperience = currentYear - teachingStartYear;
  const dancingExperience = currentYear - dancingStartYear;

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100" id="about-us">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
          {/* Image Container */}
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-xl shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
              <Image
                src={TeacherImage}
                alt="Kathak Dance Performance"
                className="w-full h-full object-cover"
                unoptimized={true}
              />
            </div>
          </div>

          {/* Content Container */}
          <div className="w-full md:w-2/3">
            {/* Header */}
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                Miss Priyanka Bhadgaonkar
              </h2>
              <p className="text-lg text-[#EE3224] font-medium mb-6">
                Founder, Nrityapriya Dance Academy
              </p>
            </div>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center md:justify-start mb-8">
              <div className="h-0.5 w-16 bg-[#EE3224]"></div>
              <div className="h-0.5 w-8 bg-gray-300 ml-2"></div>
            </div>

            {/* Main Content */}
            <div className="space-y-4 text-gray-600">
              <p className="text-lg">
                Miss Priyanka Bhadgaonkar is an accomplished Indian classical dancer,
                choreographer, and Kathak teacher. Having practiced Kathak since the
                age of five, she received her training under the esteemed guidance
                of Shri Guru Rajesh Sonagraji.
              </p>
              <p>
                A <span className="font-semibold">Nritya Visharad</span> and holder
                of a Master's degree in Kathak, she is a certified and registered
                Kathak teacher under{' '}
                <span className="font-semibold">
                  Akhil Bhartiya Gandharva Mahavidyalaya
                </span>
                . Additionally, she is a certified member of the International Dance
                Council (UNESCO).
              </p>
              <p>
                Throughout her career, she has been part of numerous classical dance
                ballets and has earned several accolades at district, state, and
                national-level dance competitions.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-[#EE3224] font-bold text-2xl">{teachingExperience} Years</p>
                <p className="text-gray-600">Teaching Experience</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-[#EE3224] font-bold text-2xl">{dancingExperience} Years</p>
                <p className="text-gray-600">Dancing Experience</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-[#EE3224] font-bold text-2xl">Master's</p>
                <p className="text-gray-600">in Performing Arts</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8 flex justify-center md:justify-start">
              <a
                href="https://instagram.com/nrityapriya_"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-3 bg-[#EE3224] text-white rounded-full shadow-lg hover:bg-[#D82C1F] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Instagram className="w-5 h-5 mr-2" />
                Follow on Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}