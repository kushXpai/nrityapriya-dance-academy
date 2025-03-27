import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from "../../firebase/firebaseConfig";

export default function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(null);

    // Fetch testimonials from Firestore
    useEffect(() => {
      const fetchTestimonials = async () => {
        try {
          const testimonialsCollection = collection(db, 'testimonials');
          const testimonialsSnapshot = await getDocs(testimonialsCollection);
          const testimonialsList = testimonialsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date?.toDate().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) || new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          }));
          setTestimonials(testimonialsList);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching testimonials:", error);
          setLoading(false);
        }
      };
  
      fetchTestimonials();
    }, []);
  
    // Add new testimonial
    const handleAddTestimonial = async (formData) => {
      try {
        const newTestimonial = {
          ...formData,
          date: new Date(),
          status: formData.status || 'Published'
        };
        
        const docRef = await addDoc(collection(db, 'testimonials'), newTestimonial);
        
        setTestimonials([...testimonials, {
          id: docRef.id,
          ...newTestimonial,
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        }]);
        
        setShowAddModal(false);
      } catch (error) {
        console.error("Error adding testimonial:", error);
      }
    };
  
    // Delete testimonial
    const handleDeleteTestimonial = async (id) => {
      if (window.confirm('Are you sure you want to delete this testimonial?')) {
        try {
          await deleteDoc(doc(db, 'testimonials', id));
          setTestimonials(testimonials.filter(testimonial => testimonial.id !== id));
        } catch (error) {
          console.error("Error deleting testimonial:", error);
        }
      }
    };
  
    // Edit testimonial
    const openEditModal = (testimonial) => {
      setCurrentTestimonial(testimonial);
      setShowEditModal(true);
    };

    const handleUpdateTestimonial = async (formData) => {
      try {
        const testimonialRef = doc(db, 'testimonials', currentTestimonial.id);
        await updateDoc(testimonialRef, formData);
        
        setTestimonials(testimonials.map(item =>
          item.id === currentTestimonial.id
            ? { ...item, ...formData }
            : item
        ));
        
        setShowEditModal(false);
        setCurrentTestimonial(null);
      } catch (error) {
        console.error("Error updating testimonial:", error);
      }
    };
  
    // Modal component for adding/editing testimonials
    const TestimonialModal = ({ isEdit = false, initialData, onSave, onClose }) => {
      const [formData, setFormData] = useState(initialData);
      const nameInputRef = useRef(null);

      useEffect(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, []);

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
          ...prevData,
          [name]: value
        }));
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
      };

      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {isEdit ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  ref={nameInputRef}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                  placeholder="Student, Parent, etc."
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial</label>
                <textarea
                  name="testimonial"
                  value={formData.testimonial}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                >
                  <option value="Published">Published</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  {isEdit ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    };       
  
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="font-medium text-gray-700">Testimonials Management</h3>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
          >
            <span className="mr-1">+</span> Add Testimonial
          </button>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">Loading testimonials...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Testimonial</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testimonials.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No testimonials found. Add your first testimonial.
                    </td>
                  </tr>
                ) : (
                  testimonials.map((testimonial) => (
                    <tr key={testimonial.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-medium text-gray-900">{testimonial.name}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-500">{testimonial.role || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-500 line-clamp-2">{testimonial.testimonial}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{testimonial.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          testimonial.status === "Published" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {testimonial.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button 
                          onClick={() => openEditModal(testimonial)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteTestimonial(testimonial.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="px-6 py-3 flex items-center justify-between border-t">
          <p className="text-sm text-gray-700">
            Showing {testimonials.length} testimonial{testimonials.length !== 1 && 's'}
          </p>
        </div>
  
        {showAddModal && (
          <TestimonialModal 
            initialData={{name:'', role:'', testimonial:'', status:'Published'}} 
            onSave={handleAddTestimonial} 
            onClose={() => setShowAddModal(false)}
          />
        )}
        {showEditModal && (
          <TestimonialModal 
            isEdit={true} 
            initialData={currentTestimonial} 
            onSave={handleUpdateTestimonial} 
            onClose={() => setShowEditModal(false)}
          />
        )}

      </div>
    );
  }