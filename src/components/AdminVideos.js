import React from 'react';

export default function AdminVideos() {

  return (
    <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex justify-between items-center">
        <h3 className="font-medium text-gray-700">Video Gallery Management</h3>
        <button className="px-4 py-2 bg-[#EE3224] text-white rounded hover:bg-[#D02C1B] flex items-center">
            <span className="mr-1">+</span> Add Video
        </button>
        </div>
        <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 w-full bg-gray-200">
                <div className="flex items-center justify-center h-56 bg-gray-100 text-gray-500">
                    <div className="text-center">
                    <div className="text-4xl mb-2">🎬</div>
                    <p>Video Thumbnail {i}</p>
                    </div>
                </div>
                </div>
                <div className="p-4">
                <div className="flex justify-between">
                    <h4 className="font-medium text-gray-800">Annual Performance {i}</h4>
                    <span className="text-sm text-gray-500">03:{i}5</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                    Highlights from our {i === 1 ? "Kathak" : i === 2 ? "Semi-Classical" : i === 3 ? "Annual Day" : "Special"} performance at the Cultural Festival 2024.
                </p>
                <div className="mt-4 flex justify-between items-center">
                    <p className="text-xs text-gray-500">Published: Feb {i + 15}, 2024</p>
                    <div className="flex space-x-2">
                    <button className="p-1 text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button className="p-1 text-red-600 hover:text-red-900">Delete</button>
                    </div>
                </div>
                </div>
            </div>
            ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-700">Showing 1 to 4 of 12 videos</p>
            <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded text-sm bg-gray-50 text-gray-500">Previous</button>
            <button className="px-3 py-1 border rounded text-sm bg-gray-50 text-gray-500">Next</button>
            </div>
        </div>
        </div>
    </div>
  );
}