import React from 'react';

export default function AdminTestimonials() {

  return (
    <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex justify-between items-center">
        <h3 className="font-medium text-gray-700">Testimonials Management</h3>
        <button className="px-4 py-2 bg-[#EE3224] text-white rounded hover:bg-[#D02C1B] flex items-center">
            <span className="mr-1">+</span> Add Testimonial
        </button>
        </div>
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Testimonial</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {[
                { name: "Meera Joshi", testimonial: "Learning Kathak at NrityaPriya has been a transformative experience. The teachers are exceptional and the environment is very supportive.", rating: 5, date: "Apr 10, 2024", status: "Published" },
                { name: "Arjun Singh", testimonial: "My daughter has shown remarkable improvement since joining the academy. Very professional teaching methods.", rating: 4, date: "Mar 22, 2024", status: "Published" },
                { name: "Priya Nair", testimonial: "The academy has a wonderful approach to teaching classical dance. Highly recommend for anyone interested in learning Kathak.", rating: 5, date: "Feb 18, 2024", status: "Published" },
                { name: "Vikram Mehta", testimonial: "Great experience! The instructors are very knowledgeable and patient with beginners.", rating: 4, date: "Jan 30, 2024", status: "Pending" },
                { name: "Aisha Khan", testimonial: "I've tried several dance academies, but NrityaPriya stands out for its authentic teaching and cultural appreciation.", rating: 5, date: "Jan 15, 2024", status: "Published" }
            ].map((testimonial, i) => (
                <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-medium text-gray-900">{testimonial.name}</p>
                </td>
                <td className="px-6 py-4">
                    <p className="text-sm text-gray-500 line-clamp-2">{testimonial.testimonial}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex text-yellow-400">
                    {Array(5).fill(0).map((_, idx) => (
                        <span key={idx} className={idx < testimonial.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                    ))}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{testimonial.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                    testimonial.status === "Published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                    {testimonial.status}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
        <div className="px-6 py-3 flex items-center justify-between border-t">
        <p className="text-sm text-gray-700">Showing 1 to 5 of 18 testimonials</p>
        <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded text-sm bg-gray-50 text-gray-500">Previous</button>
            <button className="px-3 py-1 border rounded text-sm bg-gray-50 text-gray-500">Next</button>
        </div>
        </div>
    </div>
  );
}