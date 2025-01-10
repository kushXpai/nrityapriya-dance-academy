import Image from 'next/image'
import { useState } from 'react';
import CourseImage1 from '../../public/images/CourseImage/CourseImage-1.jpg';
import CourseImage2 from '../../public/images/CourseImage/CourseImage-2.jpg';
import CourseImage3 from '../../public/images/CourseImage/CourseImage-3.jpg';
import CourseImage4 from '../../public/images/CourseImage/CourseImage-4.jpg';
import CourseImage5 from '../../public/images/CourseImage/CourseImage-5.jpg';
import CourseImage6 from '../../public/images/CourseImage/CourseImage-6.jpg';
import CourseImage7 from '../../public/images/CourseImage/CourseImage-7.jpg';

export default function CoursesSection() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedCard, setExpandedCard] = useState(null);

  const kathakCourses = [
    {
      title: "Prarambhik",
      year: "1st Year",
      duration: "1 Year",
      type: "kathak",
      description: "Basics of Kathak, including Teentaal, Tatkaar, Tihaais, rhythm patterns, and recitation techniques. Covers historical significance and key Kathak personalities.",
      image: CourseImage1,
    },
    {
      title: "Praveshika Pratham",
      year: "2nd Year",
      duration: "1 Year",
      type: "kathak",
      description: "Builds on basics with new Taals, hand gestures (Abhinav Darpan), and compositions like Rangmanch Pranam. Focus on Abhinay Geet and foundational performance elements.",
      image: CourseImage2,
    },
    {
      title: "Praveshika Poorna",
      year: "3rd Year",
      duration: "1 Year",
      type: "kathak",
      description: "Completes elementary training with advanced gestures, artist studies, and performances like Krishna Leela. Combines practical and theoretical exams.",
      image: CourseImage3,
    },
    {
      title: "Madhyama Pratham",
      year: "4th Year",
      duration: "1 Year",
      type: "kathak",
      description: "Focuses on gestures, expressions, Gharanas, and iconic movements like Jhoomar. Includes biographies of legends like Pandit Bindadin Maharaj.",
      image: CourseImage4,
    },
    {
      title: "Madhyama Poorna",
      year: "5th Year",
      duration: "1 Year",
      type: "kathak",
      description: "Emphasizes Shri Shiv Vandana, Taal recitation, and Hori performances, enhancing emotional expression and refining skills.",
      image: CourseImage5,
    },
    {
      title: "Visharad Pratham",
      year: "6th Year",
      duration: "2 Years",
      type: "kathak",
      description: "Advanced training for concert-level performance, mastering expressions of Hindu deities like Vishnu. Prepares for professional dance.",
      image: CourseImage6,
    },
    {
      title: "Visharad Poorna",
      year: "7th Year",
      duration: "2 Years",
      type: "kathak",
      description: "Final level focusing on the 9 Rasas, choreography, and stage performance. Graduates as accomplished Kathak professionals.",
      image: CourseImage7,
    },
  ];

  const semiClassicalCourses = [
    {
      title: "Semi-Classical Dance Basics",
      duration: "6 Months",
      type: "semi-classical",
      description: "A beginner-friendly course covering basic moves and semi-classical dance techniques. Perfect for those new to dance and interested in modern classical fusion.",
      image: CourseImage4,
    },
  ];

  const allCourses = [...kathakCourses, ...semiClassicalCourses];

  const filteredCourses = activeFilter === 'all' 
    ? allCourses 
    : allCourses.filter(course => course.type === activeFilter);

  return (
    <section className="py-16 bg-gray-50" id="courses">
      {/* Sticky Header with Filters */}
      <div className="sticky top-0 bg-gray-50/95 backdrop-blur-sm py-4 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">
            Courses Offered
          </h2>
          
          <div className="flex gap-3 justify-center flex-wrap mb-4">
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === 'all' 
                  ? 'bg-[#EE3224] text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              All Courses
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === 'kathak' 
                  ? 'bg-[#EE3224] text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              onClick={() => setActiveFilter('kathak')}
            >
              Classical Kathak
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === 'semi-classical' 
                  ? 'bg-[#EE3224] text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              onClick={() => setActiveFilter('semi-classical')}
            >
              Semi-Classical
            </button>
          </div>

          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            All courses, whether Kathak or Semi-Classical, are available in both online and offline modes. 
            Learn from the comfort of your home or join us at our studio.
          </p>
        </div>
      </div>

      {/* Courses Grid with Horizontal Scroll on Mobile */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="overflow-x-auto pb-6 sm:overflow-visible">
            <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 min-w-max sm:min-w-0">
              {filteredCourses.map((course, index) => (
                <div
                  key={index}
                  className="w-72 sm:w-auto bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  onMouseEnter={() => setExpandedCard(index)}
                  onMouseLeave={() => setExpandedCard(null)}
                >
                  <div className="p-6">
                    <div className="aspect-square w-40 mx-auto mb-6 relative">
                      <Image
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="text-xl font-semibold text-gray-800">
                          {course.title}
                        </h4>
                        <span className="text-sm font-medium text-[#EE3224] whitespace-nowrap px-3 py-1 bg-red-50 rounded-full">
                          {course.year || course.duration}
                        </span>
                      </div>

                      <p className={`text-gray-600 transition-all duration-300 ${
                        expandedCard === index ? 'line-clamp-none' : 'line-clamp-3'
                      }`}>
                        {course.description}
                      </p>

                      {/* Expand/Collapse Indicator */}
                      <button 
                        className="text-[#EE3224] text-sm font-medium hover:underline"
                        onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                      >
                        {expandedCard === index ? 'Show less' : 'Read more'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicators (visible only on mobile) */}
          <div className="sm:hidden absolute inset-y-0 left-0 flex items-center">
            <div className="w-8 h-full bg-gradient-to-r from-gray-50 to-transparent" />
          </div>
          <div className="sm:hidden absolute inset-y-0 right-0 flex items-center">
            <div className="w-8 h-full bg-gradient-to-l from-gray-50 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}