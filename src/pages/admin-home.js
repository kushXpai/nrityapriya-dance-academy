import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { createClient } from "@supabase/supabase-js";
import { auth } from "../../firebase/firebaseConfig";
import Link from "next/link";
import AdminProfile from "@/components/AdminProfile";
import AdminStudents from "@/components/AdminStudents";
import AdminPhotos from "@/components/AdminPhotos";
import AdminVideos from "@/components/AdminVideos";
import AdminTestimonials from "@/components/AdminTestimonials";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminHome() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/admin");
      } else {
        setUser(data.user);
      }
    };
    
    getUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          router.push("/admin");
        } else if (session?.user) {
          setUser(session.user);
        }
      }
    );
    
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  const handleMenuItemClick = (itemId) => {
    setActiveSection(itemId);
    setIsMobileMenuOpen(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-pink-500 border-r-pink-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "students", label: "Students", icon: "👥" },
    { id: "photos", label: "Photos", icon: "📷" },
    { id: "videos", label: "Videos", icon: "🎬" },
    { id: "testimonials", label: "Testimonials", icon: "💬" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-20 md:hidden">
        <div className="flex items-center justify-between bg-[#EE3224] p-4">
          <h1 className="text-xl font-bold text-white">NrityaPriya Admin</h1>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none"
          >
            {isMobileMenuOpen ? '✖' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-10 md:hidden">
          <div 
            className="absolute inset-0 bg-black opacity-50" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-md">
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#EE3224] rounded-full flex items-center justify-center text-white font-bold">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-800 truncate">{user.email}</p>
                  <p className="text-sm text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
            <nav className="p-2">
              <ul>
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button 
                      onClick={() => handleMenuItemClick(item.id)}
                      className={`w-full flex items-center p-3 space-x-3 rounded-lg text-left ${
                        activeSection === item.id 
                          ? "bg-[#FEECE7] text-[#EE3224]" 
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="absolute bottom-0 w-full p-4 border-t">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <span className="mr-2">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-white shadow-md">
        <div className="p-4 bg-[#EE3224]">
          <h1 className="text-xl font-bold text-white">NrityaPriya Admin</h1>
        </div>
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#EE3224] rounded-full flex items-center justify-center text-white font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-800 truncate">{user.email}</p>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
        <nav className="p-2">
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <button 
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center p-3 space-x-3 rounded-lg text-left ${
                    activeSection === item.id 
                      ? "bg-[#FEECE7] text-[#EE3224]" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <span className="mr-2">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto pt-16 md:pt-0">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">{menuItems.find(item => item.id === activeSection)?.label}</h2>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-500 hover:text-pink-600">
                View Website
              </Link>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {activeSection === "profile" && (
            <AdminProfile />
          )}
          
          {activeSection === "students" && (
            <AdminStudents />
          )}
          
          {activeSection === "photos" && (
            <AdminPhotos />
          )}
          
          {activeSection === "videos" && (
            <AdminVideos />
          )}
          
          {activeSection === "testimonials" && (
            <AdminTestimonials />
          )}
        </main>
      </div>
    </div>
  );
}