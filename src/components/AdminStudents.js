import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  addDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

// Status configurations remain the same
const REVIEW_STATUSES = {
  unreviewed: { 
    label: 'Unreviewed', 
    color: 'bg-yellow-100 text-yellow-800' 
  },
  'in progress': { 
    label: 'In Progress', 
    color: 'bg-blue-100 text-blue-800' 
  },
  completed: { 
    label: 'Completed', 
    color: 'bg-green-100 text-green-800' 
  }
};

const ENROLLMENT_STATUSES = {
  underreview: { 
    label: 'Under Review', 
    color: 'bg-yellow-100 text-yellow-800' 
  },
  notenrolled: { 
    label: 'Not Enrolled', 
    color: 'bg-red-100 text-red-800' 
  },
  enrolled: { 
    label: 'Enrolled', 
    color: 'bg-green-100 text-green-800' 
  }
};

export default function AdminStudents() {
  const [inquiredStudents, setInquiredStudents] = useState([]);
  const [notEnrolledStudents, setNotEnrolledStudents] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch student inquiries (modified to include all students, not just incomplete)
  const fetchStudentInquiries = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "student_inquiries"));
      const querySnapshot = await getDocs(q);
      
      const inquiries = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        // Filter to keep students except those who are Completed + Not Enrolled or Completed + Enrolled
        .filter(student => 
          !(student.review === "completed" && 
            (student.status === "notenrolled" || student.status === "enrolled"))
        );

      setInquiredStudents(inquiries);
    } catch (error) {
      console.error("Error fetching student inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch not enrolled students (only Completed + Not Enrolled)
  const fetchNotEnrolledStudents = async () => {
    try {
      const q = query(
        collection(db, "student_inquiries"), 
        where("review", "==", "completed"),
        where("status", "==", "notenrolled")
      );
      const querySnapshot = await getDocs(q);
      
      const students = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setNotEnrolledStudents(students);
    } catch (error) {
      console.error("Error fetching not enrolled students:", error);
    }
  };

  // Fetch enrolled students (only Completed + Enrolled)
  const fetchEnrolledStudents = async () => {
    try {
      const enrolledFromInquiries = query(
        collection(db, "student_inquiries"), 
        where("review", "==", "completed"),
        where("status", "==", "enrolled")
      );
      const inquirySnapshot = await getDocs(enrolledFromInquiries);
      
      const inquiryStudents = inquirySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const existingEnrolled = query(collection(db, "students"));
      const existingSnapshot = await getDocs(existingEnrolled);
      
      const existingStudents = existingSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setEnrolledStudents([...inquiryStudents, ...existingStudents]);
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
    }
  };

  // Update review status
  const updateReviewStatus = async (studentId, newStatus) => {
    try {
      const studentRef = doc(db, "student_inquiries", studentId);
      await updateDoc(studentRef, { review: newStatus });
      
      // Refresh all lists to ensure correct filtering
      fetchStudentInquiries();
      fetchNotEnrolledStudents();
      fetchEnrolledStudents();
    } catch (error) {
      console.error("Error updating review status:", error);
    }
  };

  // Update enrollment status
  const updateEnrollmentStatus = async (studentId, newStatus) => {
    try {
      const studentRef = doc(db, "student_inquiries", studentId);
      
      // Update the status
      await updateDoc(studentRef, { status: newStatus });
      
      // Refresh all lists to ensure correct filtering
      fetchStudentInquiries();
      fetchNotEnrolledStudents();
      fetchEnrolledStudents();
    } catch (error) {
      console.error("Error updating enrollment status:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchStudentInquiries();
    fetchNotEnrolledStudents();
    fetchEnrolledStudents();
  }, []);

  // Render status dropdown (no changes)
  const renderStatusDropdown = (currentStatus, statuses, onStatusChange) => (
    <div className="relative inline-block w-full">
      <select
        value={currentStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="w-full appearance-none bg-transparent text-sm"
      >
        {Object.keys(statuses).map((status) => (
          <option key={status} value={status}>
            {statuses[status].label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );

  // Render section with enhanced status display (modified to remove action column for enrolled and not enrolled)
  const renderStudentSection = (title, students, type) => (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-6 border-b flex justify-between items-center">
        <h3 className="font-medium text-gray-700">{title}</h3>
        <span className="text-sm text-gray-500">Total: {students.length}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              
              {type === 'inquired' && (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Status</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id}>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.mode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.mobile}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                
                {type === 'inquired' && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                        ${REVIEW_STATUSES[student.review || 'unreviewed'].color}`}>
                        {renderStatusDropdown(
                          student.review || 'unreviewed', 
                          REVIEW_STATUSES, 
                          (newStatus) => updateReviewStatus(student.id, newStatus)
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                        ${ENROLLMENT_STATUSES[student.status || 'underreview'].color}`}>
                        {renderStatusDropdown(
                          student.status || 'underreview', 
                          ENROLLMENT_STATUSES, 
                          (newStatus) => updateEnrollmentStatus(student.id, newStatus)
                        )}
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Management</h2>
      
      {/* Inquired Students Section */}
      {renderStudentSection(
        "Inquired Students", 
        inquiredStudents, 
        'inquired'
      )}

      {/* Enrolled Students Section */}
      {renderStudentSection(
        "Enrolled Students", 
        enrolledStudents, 
        'enrolledOnly'
      )}

      {/* Not Enrolled Students Section */}
      {renderStudentSection(
        "Not Enrolled Students", 
        notEnrolledStudents, 
        'notEnrolledOnly'
      )}
    </div>
  );
}