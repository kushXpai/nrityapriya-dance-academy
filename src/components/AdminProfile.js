import React, { useState, useEffect } from 'react';
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from 'react-toastify';

export default function AdminProfile() {
    // Initial state with social media profiles
    const [profileData, setProfileData] = useState({
        academyName: "NrityaPriya Dance Academy",
        founderName: "Miss Priyanka Bhadgaonkar",
        email: "",
        phoneNumber: "",
        address: "",
        aboutAcademy: `NrityaPriya Dance Academy is dedicated to preserving and promoting the rich tradition of Indian classical dance, with a focus on Kathak and semi-classical dance forms.`,
        founderBios: [
            `Miss Priyanka Bhadgaonkar is an accomplished Indian classical dancer, choreographer, and Kathak teacher. Having practiced Kathak since the age of five, she received her training under the esteemed guidance of Shri Guru Rajesh Sonagraji.`
        ],
        socialProfiles: {
            instagram: "",
            facebook: "",
            youtube: "",
            linkedin: ""
        }
    });

    // Fetch existing data from Firestore on component mount
    useEffect(() => {
        const fetchAcademyProfile = async () => {
            try {
                const docRef = doc(db, "academyProfiles", "mainProfile");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setProfileData(prevState => ({
                        ...prevState,
                        email: data.email || "",
                        phoneNumber: data.phoneNumber || "",
                        address: data.address || "",
                        aboutAcademy: data.aboutAcademy || prevState.aboutAcademy,
                        founderBios: data.founderBios || prevState.founderBios,
                        socialProfiles: data.socialProfiles || prevState.socialProfiles
                    }));
                }
            } catch (error) {
                toast.error("Error fetching academy profile");
                console.error("Error fetching academy profile:", error);
            }
        };

        fetchAcademyProfile();
    }, []);

    // Handle input changes for editable fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle social profile input changes
    const handleSocialProfileChange = (platform, value) => {
        setProfileData(prevState => ({
            ...prevState,
            socialProfiles: {
                ...prevState.socialProfiles,
                [platform]: value
            }
        }));
    };

    // Add a new bio section
    const addBioSection = () => {
        setProfileData(prevState => ({
            ...prevState,
            founderBios: [...prevState.founderBios, ""]
        }));
    };

    // Update a specific bio section
    const updateBioSection = (index, value) => {
        const newBios = [...profileData.founderBios];
        newBios[index] = value;
        setProfileData(prevState => ({
            ...prevState,
            founderBios: newBios
        }));
    };

    // Remove a bio section
    const removeBioSection = (index) => {
        const newBios = profileData.founderBios.filter((_, i) => i !== index);
        setProfileData(prevState => ({
            ...prevState,
            founderBios: newBios
        }));
    };

    // Save changes to Firestore
    const handleSaveChanges = async () => {
        try {
            const docRef = doc(db, "academyProfiles", "mainProfile");

            // Prepare data to update
            const updateData = {
                email: profileData.email,
                phoneNumber: profileData.phoneNumber,
                address: profileData.address,
                aboutAcademy: profileData.aboutAcademy,
                founderBios: profileData.founderBios,
                socialProfiles: profileData.socialProfiles
            };

            // Use setDoc to create or completely replace the document
            await setDoc(docRef, updateData);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Error updating profile");
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium text-black mb-4">Academy Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-black mb-1">Academy Name</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded bg-gray-100 text-black"
                            value={profileData.academyName}
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-black mb-1">Founder Name</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded bg-gray-100 text-black"
                            value={profileData.founderName}
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-black mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500 text-black"
                            value={profileData.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-black mb-1">Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            className="w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500 text-black"
                            value={profileData.phoneNumber}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Social Profiles Section */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-black mb-2">Social Profiles</label>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <img src="https://img.icons8.com/color/24/000000/instagram-new--v1.png" alt="Instagram" className="mr-2" />
                                <input
                                    type="text"
                                    placeholder="Instagram Profile URL"
                                    className="w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500 text-black"
                                    value={profileData.socialProfiles.instagram}
                                    onChange={(e) => handleSocialProfileChange('instagram', e.target.value)}
                                />
                            </div>
                            <div className="flex items-center">
                                <img src="https://img.icons8.com/color/24/000000/facebook-new.png" alt="Facebook" className="mr-2" />
                                <input
                                    type="text"
                                    placeholder="Facebook Profile URL"
                                    className="w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500 text-black"
                                    value={profileData.socialProfiles.facebook}
                                    onChange={(e) => handleSocialProfileChange('facebook', e.target.value)}
                                />
                            </div>
                            <div className="flex items-center">
                                <img src="https://img.icons8.com/color/24/000000/youtube-play.png" alt="YouTube" className="mr-2" />
                                <input
                                    type="text"
                                    placeholder="YouTube Channel URL"
                                    className="w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500 text-black"
                                    value={profileData.socialProfiles.youtube}
                                    onChange={(e) => handleSocialProfileChange('youtube', e.target.value)}
                                />
                            </div>
                            <div className="flex items-center">
                                <img src="https://img.icons8.com/color/24/000000/linkedin.png" alt="LinkedIn" className="mr-2" />
                                <input
                                    type="text"
                                    placeholder="LinkedIn Profile URL"
                                    className="w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500 text-black"
                                    value={profileData.socialProfiles.linkedin}
                                    onChange={(e) => handleSocialProfileChange('linkedin', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-black mb-1">Address</label>
                        <textarea
                            name="address"
                            className="w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500 text-black"
                            rows="3"
                            value={profileData.address}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-black mb-1">About Academy</label>
                        <textarea
                            name="aboutAcademy"
                            className="w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500 text-black"
                            rows="3"
                            value={profileData.aboutAcademy}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>

                    {/* Founder Bios Section */}
                    {profileData.founderBios.map((bio, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-black">
                                    Founder Bio - Section {index + 1}
                                </label>
                                {profileData.founderBios.length > 1 && (
                                    <button
                                        onClick={() => removeBioSection(index)}
                                        className="text-red-500 text-sm"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <textarea
                                className="w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500 text-black"
                                rows="3"
                                value={bio}
                                onChange={(e) => updateBioSection(index, e.target.value)}
                            ></textarea>
                        </div>
                    ))}

                    {/* Add Bio Section Button */}
                    <div className="mb-4">
                        <button
                            onClick={addBioSection}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Add Bio Section
                        </button>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleSaveChanges}
                            className="px-4 py-2 bg-[#EE3224] text-white rounded hover:bg-[#D02C1B]"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}