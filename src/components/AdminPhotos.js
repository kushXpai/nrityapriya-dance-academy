import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import Image from "next/image";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminPhotos() {
    // Form state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [photoFile, setPhotoFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [viewMode, setViewMode] = useState("grid");

    // Photos collection state
    const [photos, setPhotos] = useState([]);
    const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);

    const router = useRouter();

    useEffect(() => {
        fetchPhotos();
    }, []);

    // Fetch photos from Supabase
    const fetchPhotos = async () => {
        setIsLoadingPhotos(true);
        try {
            const { data, error } = await supabase
                .from("photos")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setPhotos(data || []);
        } catch (error) {
            console.error("Error fetching photos:", error.message);
            setMessage({
                text: "Failed to load photos. Please try again.",
                type: "error",
            });
        } finally {
            setIsLoadingPhotos(false);
        }
    };

    // Handle photo file selection
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setPhotoFile(file);
        } else {
            setPhotoFile(null);
            setMessage({
                text: "Please select a valid image file.",
                type: "error",
            });
        }
    };

    // Generate a unique filename
    const generateUniqueFileName = (file) => {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 12);
        const fileExtension = file.name.split(".").pop();
        return `${timestamp}-${randomString}.${fileExtension}`;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!name || !description || !photoFile) {
            setMessage({
                text: "Please fill in all fields and upload a photo.",
                type: "error",
            });
            return;
        }
    
        setIsLoading(true);
        setMessage({ text: "", type: "" });
    
        try {
            // 1. Upload photo to Supabase Storage
            const photoFileName = generateUniqueFileName(photoFile);
            const { data: photoData, error: photoError } = await supabase.storage
                .from("photos")
                .upload(photoFileName, photoFile);
    
            if (photoError) throw photoError;
    
            // 2. Get proper public URL for the uploaded file
            const photoUrl = supabase.storage.from('photos').getPublicUrl(photoFileName).data.publicUrl;
    
            // 3. Store photo metadata in Supabase database
            const { data, error } = await supabase.from("photos").insert([
                {
                    name,
                    description,
                    photo_url: photoUrl,
                    created_at: new Date(),
                },
            ]);
    
            if (error) throw error;
    
            // 4. Reset form and show success message
            setName("");
            setDescription("");
            setPhotoFile(null);
            setMessage({
                text: "Photo uploaded successfully!",
                type: "success",
            });
    
            // 5. Refresh the photos list
            fetchPhotos();
        } catch (error) {
            console.error("Error uploading photo:", error.message);
            setMessage({
                text: `Failed to upload photo: ${error.message}`,
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Handle photo deletion
    const handleDeletePhoto = async (id, photoUrl) => {
        if (!confirm("Are you sure you want to delete this photo?")) return;
    
        setIsLoading(true);
        try {
            // Extract filename from URL
            const photoFileName = photoUrl.split('/').pop();
    
            // Delete the photo from the database
            const { error } = await supabase
                .from("photos")
                .delete()
                .eq("id", id);
    
            if (error) throw error;
    
            // Delete the photo file from storage
            const { error: photoDeleteError } = await supabase.storage
                .from("photos")
                .remove([photoFileName]);
    
            if (photoDeleteError) console.error("Error deleting photo file:", photoDeleteError);
    
            setMessage({
                text: "Photo deleted successfully!",
                type: "success",
            });
    
            // Refresh the photos list
            fetchPhotos();
        } catch (error) {
            console.error("Error deleting photo:", error.message);
            setMessage({
                text: `Failed to delete photo: ${error.message}`,
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Upload Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upload New Photo</h3>

                {message.text && (
                    <div
                        className={`p-4 mb-4 rounded-md ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
                            Photo Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EE3224] text-black"
                            placeholder="Enter photo title"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-black mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EE3224] text-black"
                            placeholder="Enter photo description"
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="photo" className="block text-sm font-medium text-black mb-1">
                            Photo File
                        </label>
                        <input
                            type="file"
                            id="photo"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EE3224] text-black"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Upload JPG, PNG, WEBP, or other image formats
                        </p>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-4 py-2 font-medium rounded-md text-white ${isLoading ? "bg-gray-400" : "bg-[#EE3224] hover:bg-red-700"
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EE3224]`}
                        >
                            {isLoading ? "Uploading..." : "Upload Photo"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Photos Display */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Photos Gallery</h3>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded ${viewMode === "grid" ? "bg-[#FEECE7] text-[#EE3224]" : "bg-gray-100 text-gray-600"
                                }`}
                            aria-label="Grid view"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded ${viewMode === "list" ? "bg-[#FEECE7] text-[#EE3224]" : "bg-gray-100 text-gray-600"
                                }`}
                            aria-label="List view"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {isLoadingPhotos ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-12 h-12 border-4 border-t-[#EE3224] border-r-[#EE3224] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    </div>
                ) : photos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-lg">No photos uploaded yet</p>
                        <p className="text-sm">Your uploaded photos will appear here</p>
                    </div>
                ) : (
                    <>
                        {viewMode === "grid" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {photos.map((photo) => (
                                    <div key={photo.id} className="bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
                                        <div className="relative h-48 bg-gray-200">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={photo.photo_url}
                                                alt={photo.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <a
                                                    href={photo.photo_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-[#EE3224] text-white p-2 rounded-full hover:bg-red-700"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-medium text-gray-900 mb-1 truncate">{photo.name}</h4>
                                            <p className="text-sm text-gray-500 mb-2 line-clamp-2">{photo.description}</p>
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span>{formatDate(photo.created_at)}</span>
                                                <button
                                                    onClick={() => handleDeletePhoto(photo.id, photo.photo_url)}
                                                    className="text-red-500 hover:text-red-700"
                                                    disabled={isLoading}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="divide-y">
                                {photos.map((photo) => (
                                    <div key={photo.id} className="py-4 flex flex-col sm:flex-row">
                                        <div className="w-full sm:w-40 h-32 flex-shrink-0 mb-4 sm:mb-0 sm:mr-4 bg-gray-200 rounded-md overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={photo.photo_url}
                                                alt={photo.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <h4 className="font-medium text-gray-900 mb-1">{photo.name}</h4>
                                            <p className="text-sm text-gray-500 mb-auto">{photo.description}</p>
                                            <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                                                <span>{formatDate(photo.created_at)}</span>
                                                <div className="flex space-x-3">
                                                    <a
                                                        href={photo.photo_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[#EE3224] hover:text-red-700"
                                                    >
                                                        View
                                                    </a>
                                                    <button
                                                        onClick={() => handleDeletePhoto(photo.id, photo.photo_url)}
                                                        className="text-red-500 hover:text-red-700"
                                                        disabled={isLoading}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}