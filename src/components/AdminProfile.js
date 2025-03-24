import React from 'react';

export default function AdminProfile() {

  return (
    <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-medium text-gray-700 mb-4">Academy Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Academy Name</label>
            <input 
                type="text" 
                className="w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500" 
                defaultValue="NrityaPriya Dance Academy"
            />
            </div>
            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Founder Name</label>
            <input 
                type="text" 
                className="w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500" 
                defaultValue="Miss Priyanka Bhadgaonkar"
            />
            </div>
            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
                type="email" 
                className="w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500" 
                defaultValue="contact@nrityapriya.com"
            />
            </div>
            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input 
                type="tel" 
                className="w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500" 
                defaultValue="+91 98765 43210"
            />
            </div>
        </div>
        <div>
            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea 
                className="w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500" 
                rows="3"
                defaultValue="123 Dance Street, Arts District, Mumbai, Maharashtra 400001"
            ></textarea>
            </div>
            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">About Academy</label>
            <textarea 
                className="w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500" 
                rows="5"
                defaultValue="NrityaPriya Dance Academy is dedicated to preserving and promoting the rich tradition of Indian classical dance, with a focus on Kathak and semi-classical dance forms. Founded by Miss Priyanka Bhadgaonkar, we offer comprehensive training programs for students of all ages and skill levels."
            ></textarea>
            </div>
            <div className="flex justify-end">
            <button className="px-4 py-2 bg-[#EE3224] text-white rounded hover:bg-[#D02C1B]">
                Save Changes
            </button>
            </div>
        </div>
        </div>
    </div>
  );
}