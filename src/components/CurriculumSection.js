import { useState } from 'react';
import { ChevronDown, Book, Music, Users, Award, Clock } from 'lucide-react';

const CurriculumSection = () => {
  const [activeTab, setActiveTab] = useState('kathak');
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  const kathakContent = {
    practical: {
      title: "Practical Learning",
      icon: <Users className="w-5 h-5 text-[#EE3224]" />,
      items: [
        {
          title: "Advanced Footwork",
          details: [
            "Variations in speed (Vilambit, Madhya, Drut)",
            "Practice of intricate patterns in sync with Taal",
            "Complex footwork compositions",
            "Speed variations and control"
          ]
        },
        {
          title: "Chakkars (Spins)",
          details: [
            "Different types of spins",
            "Perfecting alignment, control, and aesthetics in turns",
            "Balance and posture during spins",
            "Multiple spin variations"
          ]
        },
        {
          title: "Correct Body Postures",
          details: [
            "How to maintain grace and balance in movements",
            "Postural discipline for seamless transitions",
            "Maintaining physical and mental balance for well being",
            "Proper alignment techniques"
          ]
        },
        {
          title: "Facial Expressions",
          details: [
            "Navarasa (9 emotions)",
            "Expressive storytelling through Bhava and Rasa",
            "Character portrayal techniques",
            "Emotional connection with audience"
          ]
        }
      ]
    },
    theoretical: {
      title: "Theoretical Learning",
      icon: <Book className="w-5 h-5 text-[#EE3224]" />,
      items: [
        {
          title: "Taal and Laya (Rhythm and Tempo)",
          details: [
            "Detailed study of important Taals (Teentaal, Jhaptaal, Ektaal, etc.)",
            "Understanding the relationship between rhythm and expression",
            "Practice of various tempo variations",
            "Mastering rhythmic patterns"
          ]
        },
        {
          title: "Padhant (Recitation)",
          details: [
            "Practicing clarity and rhythmic accuracy in vocal recitation of Kathak bols",
            "Comprehending the connection between Padhant and Nritta",
            "Voice modulation techniques",
            "Rhythm and pronunciation practice"
          ]
        },
        {
          title: "History and Evolution of Kathak",
          details: [
            "Exploring the origins and development of Kathak",
            "Study of regional Gharanas (Lucknow, Jaipur, Banaras)",
            "Understanding the cultural context",
            "Learning about legendary performers"
          ]
        },
        {
          title: "Musical Instruments and Accompaniment",
          details: [
            "Basics of Tabla, Harmonium, and other accompanying instruments",
            "Coordination with live musicians",
            "Understanding musical compositions",
            "Rhythmic coordination with instruments"
          ]
        },
        {
          title: "Cultural Significance and Mythology",
          details: [
            "How storytelling in Kathak is rooted in Indian mythology",
            "Symbolism and its influence on performances",
            "Understanding traditional narratives",
            "Cultural context of different compositions"
          ]
        }
      ]
    },
    discipline: {
      title: "Other Key Skills",
      icon: <Clock className="w-5 h-5 text-[#EE3224]" />,
      items: [
        {
          title: "Discipline and Practice Ethics",
          details: [
            "Time management for riyaaz (practice)",
            "Building endurance and consistency",
            "Mental preparation techniques",
            "Performance preparation methods"
          ]
        }
      ]
    }
  };

  const semiClassicalContent = {
    technical: {
      title: "Technical Aspects",
      icon: <Award className="w-5 h-5 text-[#EE3224]" />,
      items: [
        {
          title: "Fusion of Styles",
          details: [
            "Incorporating classical movements (mudras, postures, and spins) with freer, fluid movements",
            "Elements from folk, Bollywood, and contemporary dance styles",
            "Creative movement combinations",
            "Style adaptation techniques"
          ]
        },
        {
          title: "Simplified Footwork",
          details: [
            "Using basic rhythms and patterns derived from classical dance but with relaxed execution",
            "Emphasis on grace rather than rigid technique",
            "Contemporary movement patterns",
            "Rhythm and coordination exercises"
          ]
        },
        {
          title: "Expressions and Storytelling",
          details: [
            "Focus on emotive Abhinaya but with lighter themes",
            "Use of facial expressions and gestures to tell stories",
            "Contemporary interpretation of emotions",
            "Character development techniques"
          ]
        },
        {
          title: "Improvisation and Flexibility",
          details: [
            "Less rigid rules allow for greater personal interpretation",
            "Experimentation with different music genres",
            "Creative movement exploration",
            "Personal style development"
          ]
        }
      ]
    },
    theoretical: {
      title: "Theoretical Aspects",
      icon: <Music className="w-5 h-5 text-[#EE3224]" />,
      items: [
        {
          title: "Cultural Significance",
          details: [
            "Understanding roots in Indian traditions, festivals, and mythology",
            "The evolution of semi-classical as a fusion genre",
            "Contemporary cultural context",
            "Festival and celebration dances"
          ]
        },
        {
          title: "Basic Classical Knowledge",
          details: [
            "Fundamentals of mudras (hand gestures) and their meanings",
            "Basic rhythm cycles (taal) and their application",
            "Understanding classical dance elements",
            "Traditional dance theory basics"
          ]
        },
        {
          title: "Music Interpretation",
          details: [
            "Understanding lyrics and mood to express the essence of music",
            "Adapting classical or semi-classical compositions",
            "Contemporary music interpretation",
            "Emotional connection with music"
          ]
        }
      ]
    },
    benefits: {
      title: "Key Benefits",
      icon: <Award className="w-5 h-5 text-[#EE3224]" />,
      items: [
        {
          title: "Learning Benefits",
          details: [
            "Versatility in dance styles and performance",
            "Cultural connection with modern adaptability",
            "Creative freedom and personal expression",
            "Performance readiness for various platforms",
            "Physical fitness and mental well-being"
          ]
        }
      ]
    }
  };

  const renderSection = (section) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        {section.icon}
        <h3 className="text-xl font-semibold text-black">{section.title}</h3>
      </div>
      <div className="grid gap-4">
        {section.items.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 bg-white rounded-lg hover:border-[#EE3224] transition-all duration-200"
          >
            <button
              onClick={() => toggleSection(`${section.title}-${index}`)}
              className="w-full px-4 py-3 flex justify-between items-center text-left"
            >
              <span className="font-medium text-black">{item.title}</span>
              <ChevronDown
                className={`w-5 h-5 text-[#EE3224] transition-transform duration-200 ${
                  activeSection === `${section.title}-${index}` ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            {activeSection === `${section.title}-${index}` && (
              <div className="px-4 pb-3 text-gray-600 border-t border-gray-100">
                <ul className="list-disc list-inside space-y-1 pt-2">
                  {item.details.map((detail, idx) => (
                    <li key={idx} className="hover:text-[#EE3224] transition-colors duration-200">{detail}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-black">Course Curriculum</h2>
        
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => {
              setActiveTab('kathak');
              setActiveSection(null);
            }}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === 'kathak'
                ? 'bg-[#EE3224] text-white'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            Kathak
          </button>
          <button
            onClick={() => {
              setActiveTab('semi-classical');
              setActiveSection(null);
            }}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === 'semi-classical'
                ? 'bg-[#EE3224] text-white'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            Semi-Classical
          </button>
        </div>

        <div className="space-y-8">
          {activeTab === 'kathak' ? (
            <>
              {renderSection(kathakContent.practical)}
              {renderSection(kathakContent.theoretical)}
              {renderSection(kathakContent.discipline)}
            </>
          ) : (
            <>
              {renderSection(semiClassicalContent.technical)}
              {renderSection(semiClassicalContent.theoretical)}
              {renderSection(semiClassicalContent.benefits)}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;