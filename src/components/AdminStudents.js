import React from 'react';

export default function AdminStudents() {

  return (
    <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex justify-between items-center">
        <h3 className="font-medium text-gray-700">Students Management</h3>
        <button className="px-4 py-2 bg-[#EE3224] text-white rounded hover:bg-[#D02C1B] flex items-center">
            <span className="mr-1">+</span> Add New Student
        </button>
        </div>
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {[
                { name: "Ananya Desai", course: "Kathak Intermediate", contact: "ananya@example.com", joined: "Jan 15, 2024", status: "Active" },
                { name: "Riya Sharma", course: "Semi-Classical Advanced", contact: "riya@example.com", joined: "Mar 22, 2024", status: "Active" },
                { name: "Sameer Patel", course: "Kathak Beginner", contact: "sameer@example.com", joined: "Feb 10, 2024", status: "Inactive" },
                { name: "Neha Kumar", course: "Kathak Advanced", contact: "neha@example.com", joined: "Dec 5, 2023", status: "Active" },
                { name: "Rohan Mehra", course: "Semi-Classical Beginner", contact: "rohan@example.com", joined: "Apr 8, 2024", status: "Active" }
            ].map((student, i) => (
                <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#EE3224] flex items-center justify-center mr-3 text-white font-medium">
                        {student.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                    </div>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.course}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.contact}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.joined}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                    student.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                    {student.status}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
        <div className="px-6 py-3 flex items-center justify-between border-t">
        <p className="text-sm text-gray-700">Showing 1 to 5 of 24 entries</p>
        <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded text-sm bg-gray-50 text-gray-500">Previous</button>
            <button className="px-3 py-1 border rounded text-sm bg-gray-50 text-gray-500">Next</button>
        </div>
        </div>
    </div>
  );
}