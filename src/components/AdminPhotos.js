import React, { useState, useEffect } from 'react';
import { Grid, List } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
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

export default function AdminPhotos() {
    const [photos, setPhotos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [photoName, setPhotoName] = useState('');
    const [photoDescription, setPhotoDescription] = useState('');
    const [isArchived, setIsArchived] = useState(false);
    const [viewMode, setViewMode] = useState('grid');

    // Edit modal state
    const [editingPhoto, setEditingPhoto] = useState(null);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');


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

    // Fetch photos from Cloudinary and Firestore
    const fetchPhotos = async () => {
        try {
            // Fetch Cloudinary photos
            const cloudinaryResponse = await axios.get('/api/photos');

            // Fetch Firestore metadata
            const photosRef = collection(db, 'photos');
            const querySnapshot = await getDocs(photosRef);

            // Combine Cloudinary and Firestore data
            const photosWithMetadata = cloudinaryResponse.data.map(photo => {
                const metadata = querySnapshot.docs.find(
                    doc => doc.data().publicId === photo.public_id
                )?.data();

                return {
                    ...photo,
                    name: metadata?.name || photo.original_filename,
                    description: metadata?.description || '',
                    isArchived: metadata?.isArchived || false
                };
            });

            setPhotos(photosWithMetadata);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching photos:', error);
            setIsLoading(false);
        }
    };

    // Handle file upload with metadata
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', photoName || file.name);
        formData.append('description', photoDescription);
        formData.append('isArchived', isArchived);

        try {
            setIsUploading(true);
            const response = await axios.post('/api/photos', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Add photo metadata to Firestore
            await addDoc(collection(db, 'photos'), {
                publicId: response.data.public_id,
                name: photoName || file.name,
                description: photoDescription,
                isArchived: isArchived,
                uploadedAt: new Date()
            });

            // Reset form fields
            setPhotoName('');
            setPhotoDescription('');
            setIsArchived(false);

            // Add new photo to the list
            setPhotos(prevPhotos => [
                {
                    ...response.data,
                    name: photoName || file.name,
                    description: photoDescription,
                    isArchived: isArchived
                },
                ...prevPhotos
            ]);
            setIsUploading(false);
        } catch (error) {
            console.error('Upload failed:', error);
            setIsUploading(false);
        }
    };

    // Delete photo from Cloudinary and Firestore
    const handleDeletePhoto = async (photo) => {
        try {
            const publicId = typeof photo === 'string'
                ? photo
                : photo.public_id.replace('nityapriyaphotos/', '');

            // Delete from Cloudinary
            await axios.delete(`/api/photos/${publicId}`);

            // Delete from Firestore
            const photosRef = collection(db, 'photos');
            const q = query(photosRef, where('publicId', '==',
                typeof photo === 'string'
                    ? `nityapriyaphotos/${publicId}`
                    : photo.public_id
            ));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });

            // Remove photo from local state
            setPhotos(prevPhotos =>
                prevPhotos.filter(p =>
                    typeof photo === 'string'
                        ? p.public_id !== `nityapriyaphotos/${publicId}`
                        : p.public_id !== photo.public_id
                )
            );

            alert('Photo deleted successfully');
        } catch (error) {
            alert(`Failed to delete photo: ${error.response?.data?.error || error.message}`);
        }
    };

    // Toggle archive status
    const handleToggleArchive = async (photo) => {
        try {
            const photosRef = collection(db, 'photos');
            const q = query(photosRef, where('publicId', '==', photo.public_id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0].ref;

                await updateDoc(docRef, {
                    isArchived: !photo.isArchived
                });

                setPhotos(prevPhotos =>
                    prevPhotos.map(p =>
                        p.public_id === photo.public_id
                            ? { ...p, isArchived: !p.isArchived }
                            : p
                    )
                );
            }
        } catch (error) {
            console.error('Archive toggle failed:', error);
        }
    };

    // Edit photo metadata
    const handleEditPhoto = async () => {
        if (!editingPhoto) return;

        try {
            const photosRef = collection(db, 'photos');
            const q = query(photosRef, where('publicId', '==', editingPhoto.public_id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0].ref;

                await updateDoc(docRef, {
                    name: editName,
                    description: editDescription
                });

                setPhotos(prevPhotos =>
                    prevPhotos.map(p =>
                        p.public_id === editingPhoto.public_id
                            ? {
                                ...p,
                                name: editName,
                                description: editDescription
                            }
                            : p
                    )
                );

                setEditingPhoto(null);
            }
        } catch (error) {
            console.error('Edit photo failed:', error);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    // Render photos based on view mode
    const renderPhotos = () => {
        if (viewMode === 'grid') {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {photos.map((photo) => (
                        <div
                            key={photo.public_id}
                            className={`relative group ${photo.isArchived ? 'opacity-50' : ''}`}
                        >
                            <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200 rounded-lg overflow-hidden">
                                <CldImage
                                    width="300"
                                    height="300"
                                    src={photo.public_id}
                                    alt={photo.name || photo.public_id}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all 
                                flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="flex space-x-2">
                                    <button
                                        className="p-2 bg-white rounded-full text-gray-700 hover:text-pink-500 
                                            active:scale-95 transition-transform"
                                        onClick={() => window.open(photo.secure_url, '_blank')}
                                    >
                                        👁️
                                    </button>
                                    <button
                                        className="p-2 bg-white rounded-full text-gray-700 hover:text-indigo-500 
                                            active:scale-95 transition-transform"
                                        onClick={() => {
                                            setEditingPhoto(photo);
                                            setEditName(photo.name);
                                            setEditDescription(photo.description);
                                        }}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="p-2 bg-white rounded-full text-gray-700 hover:text-red-500 
                                            active:scale-95 transition-transform"
                                        onClick={() => handleDeletePhoto(photo)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            <div className="mt-2">
                                <p className="text-sm sm:text-base font-medium text-gray-700 truncate">
                                    {photo.name}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                                    {photo.description}
                                </p>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 space-y-1 sm:space-y-0">
                                    <p className="text-xs text-gray-500">
                                        Added: {new Date(photo.created_at).toLocaleDateString()}
                                    </p>
                                    <div className="flex items-center">
                                        <span className={`text-xs mr-2 ${photo.isArchived ? 'text-red-500' : 'text-green-500'}`}>
                                            {photo.isArchived ? 'Archived' : 'Published'}
                                        </span>
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={!photo.isArchived}
                                                onChange={() => handleToggleArchive(photo)}
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

        // List view (simplified)
        return (
            <div className="space-y-4">
                {photos.map((photo) => (
                    <div
                        key={photo.public_id}
                        className="flex items-center border rounded p-4 space-x-4"
                    >
                        <CldImage
                            width="100"
                            height="100"
                            src={photo.public_id}
                            alt={photo.name}
                            className="w-24 h-24 object-cover rounded"
                        />
                        <div className="flex-grow">
                            <p className="font-medium text-black">{photo.name}</p>
                            <p className="text-sm text-gray-500">{photo.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                className="text-blue-500 hover:text-blue-700"
                                onClick={() => {
                                    setEditingPhoto(photo);
                                    setEditName(photo.name);
                                    setEditDescription(photo.description);
                                }}
                            >
                                Edit
                            </button>
                            <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeletePhoto(photo)}
                            >
                                Delete
                            </button>
                            <div className="flex items-center">
                                <span className={`text-xs mr-2 ${photo.isArchived ? 'text-red-500' : 'text-green-500'}`}>
                                    {photo.isArchived ? 'Archived' : 'Published'}
                                </span>
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={!photo.isArchived}
                                        onChange={() => handleToggleArchive(photo)}
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
                <h3 className="font-medium text-gray-700">Photo Gallery Management</h3>
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
                        placeholder="Photo Name"
                        value={photoName}
                        onChange={(e) => setPhotoName(e.target.value)}
                        className="border rounded px-3 py-2 text-black w-full"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={photoDescription}
                        onChange={(e) => setPhotoDescription(e.target.value)}
                        className="border rounded px-3 py-2 text-black w-full"
                    />
                </div>
                <div className="mt-4">
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        accept="image/*"
                        disabled={isUploading}
                    />
                    <label
                        htmlFor="file-upload"
                        className={`px-4 py-2 rounded flex items-center justify-center cursor-pointer w-full 
                            ${isUploading
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-[#EE3224] text-white hover:bg-[#D02C1B]'
                            }`}
                    >
                        {isUploading ? 'Uploading...' : '+ Upload Photos'}
                    </label>
                </div>
            </div>

            {/* Photos Section */}
            <div className="p-6">
                {isLoading ? (
                    <div className="text-center text-gray-500">Loading photos...</div>
                ) : (
                    <>
                        {renderPhotos()}

                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
                            <p className="text-sm text-gray-700 mb-2 sm:mb-0">
                                Showing {photos.length} of {photos.length} photos
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Edit Modal */}
            {editingPhoto && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-xl font-bold mb-4 text-black">Edit Photo Details</h2>
                        <input
                            type="text"
                            placeholder="Photo Name"
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
                                onClick={() => setEditingPhoto(null)}
                                className="px-4 py-2 bg-gray-200 text-black rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditPhoto}
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