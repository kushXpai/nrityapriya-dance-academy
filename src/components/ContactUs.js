import { useState } from "react";
import { FaInstagram, FaEnvelope, FaStar, FaGraduationCap, FaLaptop, FaUsers } from "react-icons/fa";
import { auth } from "../../firebase/firebaseConfig";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ContactUs() {
    const [mode, setMode] = useState("online");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        address: "",
        course: "Kathak Course",
        review: "unreviewed", // New field
        status: "underreview" // New field
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");

    const benefits = [
        {
            icon: FaStar,
            title: "Expert Guidance",
            description: "Learn from experienced Kathak practitioners"
        },
        {
            icon: FaGraduationCap,
            title: "Structured Learning",
            description: "Progressive curriculum from beginner to advanced"
        },
        {
            icon: FaLaptop,
            title: "Flexible Classes",
            description: "Choose between online and offline modes"
        },
        {
            icon: FaUsers,
            title: "Community",
            description: "Join a vibrant dance community"
        }
    ];

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage("");

        try {
            // Add data to Firestore
            const docRef = await addDoc(collection(db, "student_inquiries"), {
                ...formData,
                mode: mode,
                timestamp: serverTimestamp(),
                review: "unreviewed", // Explicitly set default
                status: "underreview" // Explicitly set default
            });

            // Reset form after successful submission
            setFormData({
                name: "",
                email: "",
                mobile: "",
                address: "",
                course: "Kathak Course",
                review: "unreviewed",
                status: "underreview"
            });

            setSubmitMessage("Your inquiry has been submitted successfully!");
            setMode("online");
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitMessage("Failed to submit. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-gray-100 to-white" id="contact-us">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Benefits Section */}
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Begin Your Kathak Journey
                    </h2>
                    <p className="text-lg text-gray-600 mb-12">
                        Discover the beauty of Kathak and embark on a journey of artistic excellence with our dance academy.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="flex justify-center mb-4">
                                    <benefit.icon className="text-4xl text-[#EE3224]" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                    {/* Left side - Social Links */}
                    <div className="w-full lg:w-1/2 space-y-6">
                        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <a
                                href="https://www.instagram.com/nrityapriya_"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-4 p-8 hover:bg-gray-50 rounded-xl"
                            >
                                <div className="bg-pink-50 p-4 rounded-full">
                                    <FaInstagram className="text-4xl text-pink-500" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800">Follow Us</h3>
                                    <p className="text-lg text-gray-600">@nrityapriya_</p>
                                    <p className="text-sm text-gray-500 mt-1">Stay updated with our latest performances</p>
                                </div>
                            </a>
                        </div>

                        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <a
                                href="mailto:nrityapriya.kathak@gmail.com"
                                className="flex items-center space-x-4 p-8 hover:bg-gray-50 rounded-xl"
                            >
                                <div className="bg-blue-50 p-4 rounded-full">
                                    <FaEnvelope className="text-4xl text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800">Email Us</h3>
                                    <p className="text-lg text-gray-600 break-all">nrityapriya.kathak@gmail.com</p>
                                    <p className="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Right side - Form */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-800">Start Your Journey</h2>
                                <p className="text-gray-600 mt-2">Fill out the form below to enroll in our classes</p>
                            </div>

                            {submitMessage && (
                                <div className={`p-4 rounded-lg text-center ${
                                    submitMessage.includes("successfully") 
                                        ? "bg-green-100 text-green-800" 
                                        : "bg-red-100 text-red-800"
                                }`}>
                                    {submitMessage}
                                </div>
                            )}

<form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                {["name", "email", "mobile"].map((field) => (
                                    <div
                                        key={field}
                                        className="group focus-within:transform focus-within:-translate-y-1 transition-transform duration-200"
                                    >
                                        <label className="text-lg font-semibold text-gray-700 capitalize block mb-2">
                                            {field}
                                        </label>
                                        <input
                                            type={field === "email" ? "email" : "text"}
                                            name={field}
                                            value={formData[field]}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-black {/* Added text-black */}
                                                focus:outline-none focus:border-[#EE3224] focus:ring-2 focus:ring-[#EE3224] 
                                                focus:ring-opacity-50 transition-all duration-300"
                                            placeholder={`Enter your ${field}`}
                                        />
                                    </div>
                                ))}

                                <div className="group focus-within:transform focus-within:-translate-y-1 transition-transform duration-200">
                                    <label className="text-lg font-semibold text-gray-700 block mb-2">Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-black {/* Added text-black */}
                                            focus:outline-none focus:border-[#EE3224] focus:ring-2 focus:ring-[#EE3224] 
                                            focus:ring-opacity-50 transition-all duration-300"
                                        placeholder="Enter your address"
                                    />
                                </div>

                                    <div className="space-y-2">
                                        <label className="text-lg font-semibold text-gray-700 block mb-2">Course Level</label>
                                        <select
                                            name="course"
                                            value={formData.course}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700
                                                focus:outline-none focus:border-[#EE3224] focus:ring-2 focus:ring-[#EE3224] 
                                                focus:ring-opacity-50 transition-all duration-300"
                                        >
                                            {[
                                                "Kathak Course",
                                                "Semiclassical Course"
                                            ].map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-lg font-semibold text-gray-700 block mb-2">Mode</label>
                                        <div className="flex gap-4">
                                            {["online", "offline"].map((modeOption) => (
                                                <button
                                                    key={modeOption}
                                                    type="button"
                                                    onClick={() => setMode(modeOption)}
                                                    className={`flex-1 px-6 py-3 rounded-lg text-lg font-semibold 
                                                    transition-all duration-300 transform hover:-translate-y-1 border-2 
                                                    ${mode === modeOption
                                                        ? "border-[#EE3224] bg-white text-gray-800 shadow-lg"
                                                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                                    }`}
                                                >
                                                    {modeOption.charAt(0).toUpperCase() + modeOption.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full px-6 py-4 bg-[#EE3224] text-white text-lg font-semibold rounded-lg 
                                        transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg
                                        ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-[#D02C1B]'}`}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Begin Your Dance Journey'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}