import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import Link from "next/link";
import AdminProfile from "@/components/AdminProfile";
import AdminStudents from "@/components/AdminStudents";
import AdminPhotos from "@/components/AdminPhotos";
import AdminVideos from "@/components/AdminVideos";
import AdminTestimonials from "@/components/AdminTestimonials";

export default function AdminHome() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("profile");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/admin");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin");
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
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
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
      <div className="flex-1 overflow-auto">
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