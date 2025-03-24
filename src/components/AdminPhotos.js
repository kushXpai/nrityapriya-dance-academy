import React from 'react';

export default function AdminPhotos() {

  return (
    <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex justify-between items-center">
        <h3 className="font-medium text-gray-700">Photo Gallery Management</h3>
        <button className="px-4 py-2 bg-[#EE3224] text-white rounded hover:bg-[#D02C1B] flex items-center">
            <span className="mr-1">+</span> Upload Photos
        </button>
        </div>
        <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="relative group">
                <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-center h-48 bg-pink-50 text-pink-500">
                    Photo {i}
                </div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                    <button className="p-2 bg-white rounded-full text-gray-700 hover:text-pink-500">
                    👁️
                    </button>
                    <button className="p-2 bg-white rounded-full text-gray-700 hover:text-indigo-500">
                    ✏️
                    </button>
                    <button className="p-2 bg-white rounded-full text-gray-700 hover:text-red-500">
                    🗑️
                    </button>
                </div>
                </div>
                <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">Performance {i}</p>
                <p className="text-xs text-gray-500">Added: Mar {i + 10}, 2024</p>
                </div>
            </div>
            ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-700">Showing 1 to 8 of 24 photos</p>
            <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded text-sm bg-gray-50 text-gray-500">Previous</button>
            <button className="px-3 py-1 border rounded text-sm bg-gray-50 text-gray-500">Next</button>
            </div>
        </div>
        </div>
    </div>
  );
}