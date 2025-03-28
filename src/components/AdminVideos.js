import React, { useState, useEffect } from 'react';
import { Grid, List } from 'lucide-react';
import axios from 'axios';
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    deleteDoc,
    updateDoc
} from 'firebase/firestore';
import { db } from "../../firebase/firebaseConfig";

export default function AdminVideos() {
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [videoName, setVideoName] = useState('');
    const [videoDescription, setVideoDescription] = useState('');
    const [isArchived, setIsArchived] = useState(false);
    const [viewMode, setViewMode] = useState('grid');

    // Edit modal state
    const [editingVideo, setEditingVideo] = useState(null);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');

    // Upload state
    const [selectedVideoFile, setSelectedVideoFile] = useState(null);
    const [selectedThumbnailFile, setSelectedThumbnailFile] = useState(null);

    const ViewModeToggle = ({ viewMode, onViewChange }) => {
        return (
            <div className="flex items-center bg-gray-100 rounded-full p-1 space-x-1">
                <button
                    onClick={() => onViewChange('grid')}
                    className={`p-2 rounded-full transition-all duration-300 ${viewMode === 'grid'
                        ? 'bg-white shadow-md text-blue-600'
                        : 'text-gray-500 hover:bg-white/50'
                        }`}
                >
                    <Grid size={20} />
                </button>
                <button
                    onClick={() => onViewChange('list')}
                    className={`p-2 rounded-full transition-all duration-300 ${viewMode === 'list'
                        ? 'bg-white shadow-md text-blue-600'
                        : 'text-gray-500 hover:bg-white/50'
                        }`}
                >
                    <List size={20} />
                </button>
            </div>
        );
    };

    // Fetch videos from Cloudinary and Firestore
    const fetchVideos = async () => {
        try {
            const cloudinaryResponse = await axios.get('/api/videos');

            const videosWithMetadata = cloudinaryResponse.data.map(video => {
                console.log('Fetched Video:', video); // Debug log
                return {
                    ...video,
                    name: video.metadata?.name || video.original_filename,
                    description: video.metadata?.description || '',
                    isArchived: video.metadata?.isArchived || false,
                    thumbnailUrl: video.metadata?.thumbnailUrl || video.thumbnail || null
                };
            });

            setVideos(videosWithMetadata);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching videos:', error);
            setIsLoading(false);
        }
    };

    // Handle video file selection
    const handleVideoFileSelect = (event) => {
        const videoFile = event.target.files[0];

        // Maximum file size (100MB)
        const maxSizeBytes = 100 * 1024 * 1024;

        if (videoFile.size > maxSizeBytes) {
            alert('File is too large. Maximum file size is 100MB.');
            event.target.value = ''; // Clear the file input
            setSelectedVideoFile(null);
            return;
        }

        setSelectedVideoFile(videoFile);
        setVideoName(videoFile.name);
    };

    // Handle thumbnail file selection
    const handleThumbnailFileSelect = (event) => {
        const thumbnailFile = event.target.files[0];
        setSelectedThumbnailFile(thumbnailFile);
    };

    // Handle file upload
    const handleUpload = async () => {
        // Validate inputs
        if (!selectedVideoFile) {
            alert('Please select a video file');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedVideoFile);

        // Thumbnail is optional
        if (selectedThumbnailFile) {
            formData.append('thumbnail', selectedThumbnailFile);
        }

        formData.append('name', videoName || selectedVideoFile.name);
        formData.append('description', videoDescription);
        formData.append('isArchived', isArchived);

        try {
            setIsUploading(true);
            const response = await axios.post('/api/videos', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log('Upload Response:', response.data); // Debug log

            // Prepare Firestore document
            const firestoreDoc = {
                publicId: response.data.public_id,
                name: videoName || selectedVideoFile.name,
                description: videoDescription,
                isArchived: isArchived,
                uploadedAt: new Date(),
                thumbnailUrl: response.data.thumbnailUrl || null
            };

            // Add video metadata to Firestore
            const docRef = await addDoc(collection(db, 'videos'), firestoreDoc);

            // Reset form fields
            setVideoName('');
            setVideoDescription('');
            setIsArchived(false);
            setSelectedVideoFile(null);
            setSelectedThumbnailFile(null);

            // Add new video to the list
            const newVideoEntry = {
                ...response.data,
                name: videoName || selectedVideoFile.name,
                description: videoDescription,
                isArchived: isArchived,
                thumbnailUrl: response.data.thumbnailUrl || null
            };

            console.log('New Video Entry:', newVideoEntry); // Debug log

            setVideos(prevVideos => [newVideoEntry, ...prevVideos]);
            setIsUploading(false);
        } catch (error) {
            console.error('Upload failed:', error);
            alert(`Upload failed: ${error.message}`);
            setIsUploading(false);
        }
    };

    // Delete video from Cloudinary and Firestore
    const handleDeleteVideo = async (video) => {
        try {
            const publicId = typeof video === 'string'
                ? video
                : video.public_id.replace('nityapriyavideos/', '');

            // Delete from Cloudinary
            await axios.delete(`/api/videos/${publicId}`);

            // Delete from Firestore
            const videosRef = collection(db, 'videos');
            const q = query(videosRef, where('publicId', '==',
                typeof video === 'string'
                    ? `nityapriyavideos/${publicId}`
                    : video.public_id
            ));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });

            // Remove video from local state
            setVideos(prevVideos =>
                prevVideos.filter(p =>
                    typeof video === 'string'
                        ? p.public_id !== `nityapriyavideos/${publicId}`
                        : p.public_id !== video.public_id
                )
            );

            alert('Video deleted successfully');
        } catch (error) {
            alert(`Failed to delete video: ${error.response?.data?.error || error.message}`);
        }
    };

    // Toggle archive status
    const handleToggleArchive = async (video) => {
        try {
            const videosRef = collection(db, 'videos');
            const q = query(videosRef, where('publicId', '==', video.public_id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0].ref;

                await updateDoc(docRef, {
                    isArchived: !video.isArchived
                });

                setVideos(prevVideos =>
                    prevVideos.map(p =>
                        p.public_id === video.public_id
                            ? { ...p, isArchived: !p.isArchived }
                            : p
                    )
                );
            }
        } catch (error) {
            console.error('Archive toggle failed:', error);
        }
    };

    // Edit video metadata
    const handleEditVideo = async () => {
        if (!editingVideo) return;

        try {
            const videosRef = collection(db, 'videos');
            const q = query(videosRef, where('publicId', '==', editingVideo.public_id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0].ref;

                await updateDoc(docRef, {
                    name: editName,
                    description: editDescription
                });

                setVideos(prevVideos =>
                    prevVideos.map(p =>
                        p.public_id === editingVideo.public_id
                            ? {
                                ...p,
                                name: editName,
                                description: editDescription
                            }
                            : p
                    )
                );

                setEditingVideo(null);
            }
        } catch (error) {
            console.error('Edit video failed:', error);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    // Render videos
    const renderVideos = () => {
        const renderThumbnail = (video) => {
            // Priority: Use thumbnailUrl from Cloudinary, then generated thumbnail, then fallback to video source
            const thumbnailSrc =
                video.thumbnailUrl ||
                video.thumbnail ||
                video.secure_url;

            return (
                <img
                    src={thumbnailSrc}
                    alt={`${video.name} thumbnail`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Fallback to video source if thumbnail fails
                        e.target.src = video.secure_url;
                        console.warn('Thumbnail failed, falling back to video source');
                    }}
                />
            );
        };

        if (viewMode === 'grid') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videos.map((video) => (
                        <div
                            key={video.public_id}
                            className={`relative group ${video.isArchived ? 'opacity-50' : ''}`}
                        >
                            <div className="aspect-w-16 aspect-h-9 w-full bg-gray-200 rounded-lg overflow-hidden relative">
                                {renderThumbnail(video)}

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        className="p-2 bg-white rounded-full text-gray-700 hover:text-pink-500 
                                            active:scale-95 transition-transform"
                                        onClick={() => window.open(video.secure_url, '_blank')}
                                    >
                                        👁️
                                    </button>
                                    <button
                                        className="p-2 bg-white rounded-full text-gray-700 hover:text-indigo-500 
                                            active:scale-95 transition-transform"
                                        onClick={() => {
                                            setEditingVideo(video);
                                            setEditName(video.name);
                                            setEditDescription(video.description);
                                        }}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="p-2 bg-white rounded-full text-gray-700 hover:text-red-500 
                                            active:scale-95 transition-transform"
                                        onClick={() => handleDeleteVideo(video)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            <div className="mt-2">
                                <p className="text-sm sm:text-base font-medium text-gray-700 truncate">
                                    {video.name}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                                    {video.description}
                                </p>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 space-y-1 sm:space-y-0">
                                    <p className="text-xs text-gray-500">
                                        Added: {new Date(video.created_at).toLocaleDateString()}
                                    </p>
                                    <div className="flex items-center">
                                        <span className={`text-xs mr-2 ${video.isArchived ? 'text-red-500' : 'text-green-500'}`}>
                                            {video.isArchived ? 'Archived' : 'Published'}
                                        </span>
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={!video.isArchived}
                                                onChange={() => handleToggleArchive(video)}
                                                className="sr-only peer"
                                            />
                                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        // List view
        return (
            <div className="space-y-4">
                {videos.map((video) => (
                    <div
                        key={video.public_id}
                        className="flex items-center border rounded p-4 space-x-4"
                    >
                        <div className="w-24 h-24 rounded overflow-hidden">
                            {renderThumbnail(video)}
                        </div>
                        <div className="flex-grow">
                            <p className="font-medium text-black">{video.name}</p>
                            <p className="text-sm text-gray-500">{video.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                className="text-blue-500 hover:text-blue-700"
                                onClick={() => {
                                    setEditingVideo(video);
                                    setEditName(video.name);
                                    setEditDescription(video.description);
                                }}
                            >
                                Edit
                            </button>
                            <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteVideo(video)}
                            >
                                Delete
                            </button>
                            <div className="flex items-center">
                                <span className={`text-xs mr-2 ${video.isArchived ? 'text-red-500' : 'text-green-500'}`}>
                                    {video.isArchived ? 'Archived' : 'Published'}
                                </span>
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={!video.isArchived}
                                        onChange={() => handleToggleArchive(video)}
                                        className="sr-only peer"
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Upload Section */}
            <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <h3 className="font-medium text-gray-700">Video Gallery Management</h3>
                <div className="flex items-center space-x-4">
                    <ViewModeToggle
                        viewMode={viewMode}
                        onViewChange={setViewMode}
                    />
                </div>
            </div>

            {/* Metadata Input Section */}
            <div className="p-6 border-b">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Video Name"
                        value={videoName}
                        onChange={(e) => setVideoName(e.target.value)}
                        className="border rounded px-3 py-2 text-black w-full"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={videoDescription}
                        onChange={(e) => setVideoDescription(e.target.value)}
                        className="border rounded px-3 py-2 text-black w-full"
                    />
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Video
                        </label>
                        <input
                            type="file"
                            onChange={handleVideoFileSelect}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            accept="video/*"
                            disabled={isUploading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Thumbnail (Optional)
                        </label>
                        <input
                            type="file"
                            onChange={handleThumbnailFileSelect}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            accept="image/*"
                            disabled={isUploading}
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <button
                        onClick={handleUpload}
                        className={`px-4 py-2 rounded flex items-center justify-center cursor-pointer w-full 
                            ${(!selectedVideoFile || isUploading)
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-[#EE3224] text-white hover:bg-[#D02C1B]'
                            }`}
                        disabled={!selectedVideoFile || isUploading}
                    >
                        {isUploading ? 'Uploading...' : '+ Upload Video'}
                    </button>
                </div>
            </div>

            {/* Videos Section */}
            <div className="p-6">
                {isLoading ? (
                    <div className="text-center text-gray-500">Loading videos...</div>
                ) : (
                    <>
                        {renderVideos()}

                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
                            <p className="text-sm text-gray-700 mb-2 sm:mb-0">
                                Showing {videos.length} of {videos.length} videos
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Edit Modal */}
            {editingVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-xl font-bold mb-4 text-black">Edit Video Details</h2>
                        <input
                            type="text"
                            placeholder="Video Name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full border rounded px-3 py-2 mb-4 text-black"
                        />
                        <textarea
                            placeholder="Description"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="w-full border rounded px-3 py-2 mb-4 text-black"
                            rows="4"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setEditingVideo(null)}
                                className="px-4 py-2 bg-gray-200 text-black rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditVideo}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}