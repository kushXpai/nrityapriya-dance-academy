import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc,
  deleteDoc,
  addDoc
} from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

// Status configurations remain the same
const REVIEW_STATUSES = {
  unreviewed: { 
    label: 'Unreviewed', 
    color: 'bg-yellow-100 text-yellow-800' 
  },
  inprogress: { 
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
  const [activeTab, setActiveTab] = useState('inquired');

  // Modified fetch methods
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

  const fetchEnrolledStudents = async () => {
    try {
      // We're no longer querying for enrolled students from student_inquiries
      // since they should be moved to the students collection
      
      const existingEnrolled = query(collection(db, "students"));
      const existingSnapshot = await getDocs(existingEnrolled);
      
      const existingStudents = existingSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setEnrolledStudents(existingStudents);
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
    }
  };

  // Modified update methods to handle the data transfer
  const updateReviewStatus = async (studentId, newStatus) => {
    try {
      const studentRef = doc(db, "student_inquiries", studentId);
      
      // Get the current student data
      const studentDoc = await getDocs(query(collection(db, "student_inquiries"), where("__name__", "==", studentId)));
      const studentData = studentDoc.docs[0]?.data();
      
      await updateDoc(studentRef, { review: newStatus });
      
      // If status is now completed and enrollment is set to enrolled,
      // move the student to the students collection
      if (newStatus === "completed" && studentData?.status === "enrolled") {
        await moveStudentToEnrolled(studentId, studentData);
      }
      
      // Refresh all lists
      fetchStudentInquiries();
      fetchNotEnrolledStudents();
      fetchEnrolledStudents();
    } catch (error) {
      console.error("Error updating review status:", error);
    }
  };

  const updateEnrollmentStatus = async (studentId, newStatus) => {
    try {
      const studentRef = doc(db, "student_inquiries", studentId);
      
      // Get the current student data
      const studentDoc = await getDocs(query(collection(db, "student_inquiries"), where("__name__", "==", studentId)));
      const studentData = studentDoc.docs[0]?.data();
      
      await updateDoc(studentRef, { status: newStatus });
      
      // If review is already completed and we're setting status to enrolled,
      // move the student to the students collection
      if (studentData?.review === "completed" && newStatus === "enrolled") {
        // Get the updated student data with the new status
        const updatedStudentDoc = await getDocs(query(collection(db, "student_inquiries"), where("__name__", "==", studentId)));
        const updatedStudentData = updatedStudentDoc.docs[0]?.data();
        
        await moveStudentToEnrolled(studentId, updatedStudentData);
      }
      
      // Refresh all lists
      fetchStudentInquiries();
      fetchNotEnrolledStudents();
      fetchEnrolledStudents();
    } catch (error) {
      console.error("Error updating enrollment status:", error);
    }
  };

  // New function to move a student from inquiries to enrolled
  const moveStudentToEnrolled = async (studentId, studentData) => {
    try {
      // Add to students collection
      await addDoc(collection(db, "students"), {
        ...studentData,
        inquiryId: studentId // Keep reference to original inquiry ID
      });
      
      // Delete from student_inquiries collection
      await deleteDoc(doc(db, "student_inquiries", studentId));
      
      console.log("Student moved to enrolled collection successfully");
    } catch (error) {
      console.error("Error moving student to enrolled collection:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchStudentInquiries();
    fetchNotEnrolledStudents();
    fetchEnrolledStudents();
  }, []);

  // Render status dropdown
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

  // Mobile-friendly card view for students
  const renderStudentCard = (student, type) => (
    <div key={student.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-[#EE3224] flex items-center justify-center mr-3 text-white font-medium">
          {student.name.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-gray-900">{student.name}</p>
          <p className="text-sm text-gray-500">{student.course}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-800">Mode</p>
          <p className="text-gray-400">{student.mode}</p>
        </div>
        <div>
          <p className="text-gray-800">Mobile</p>
          <p className="text-gray-400">{student.mobile}</p>
        </div>
        <div>
          <p className="text-gray-800">Email</p>
          <p className="text-gray-400">{student.email}</p>
        </div>
        {type === 'inquired' && (
          <>
            <div>
              <p className="text-gray-500">Review Status</p>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                ${REVIEW_STATUSES[student.review || 'unreviewed'].color}`}>
                {renderStatusDropdown(
                  student.review || 'unreviewed', 
                  REVIEW_STATUSES, 
                  (newStatus) => updateReviewStatus(student.id, newStatus)
                )}
              </div>
            </div>
            <div>
              <p className="text-gray-500">Enrollment Status</p>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                ${ENROLLMENT_STATUSES[student.status || 'underreview'].color}`}>
                {renderStatusDropdown(
                  student.status || 'underreview', 
                  ENROLLMENT_STATUSES, 
                  (newStatus) => updateEnrollmentStatus(student.id, newStatus)
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Render section (modified for mobile responsiveness)
  const renderStudentSection = (title, students, type) => {
    // For mobile view, use card layout
    const renderMobileView = () => (
      <div>
        {students.map(student => renderStudentCard(student, type))}
      </div>
    );

    // For desktop, use table
    const renderDesktopView = () => (
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
    );

    return (
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="font-medium text-gray-700">{title}</h3>
          <span className="text-sm text-gray-500">Total: {students.length}</span>
        </div>
        
        {/* Responsive rendering */}
        <div className="block md:hidden">
          {renderMobileView()}
        </div>
        <div className="hidden md:block">
          {renderDesktopView()}
        </div>
      </div>
    );
  };

  // Responsive tab navigation for mobile
  const renderMobileTabNavigation = () => (
    <div className="bg-white shadow-sm mb-4 overflow-x-auto">
      <div className="flex">
        {[
          { id: 'inquired', label: 'Inquired' },
          { id: 'enrolled', label: 'Enrolled' },
          { id: 'notEnrolled', label: 'Not Enrolled' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 p-3 text-center ${
              activeTab === tab.id 
                ? 'bg-[#EE3224] text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Management</h2>
      
      {/* Mobile Tab Navigation */}
      <div className="block md:hidden">
        {renderMobileTabNavigation()}
      </div>
      
      {/* Responsive Sections */}
      <div className="hidden md:block">
        {renderStudentSection(
          "Inquired Students", 
          inquiredStudents, 
          'inquired'
        )}

        {renderStudentSection(
          "Enrolled Students", 
          enrolledStudents, 
          'enrolledOnly'
        )}

        {renderStudentSection(
          "Not Enrolled Students", 
          notEnrolledStudents, 
          'notEnrolledOnly'
        )}
      </div>

      {/* Mobile View with Tabs */}
      <div className="block md:hidden">
        {activeTab === 'inquired' && renderStudentSection(
          "Inquired Students", 
          inquiredStudents, 
          'inquired'
        )}

        {activeTab === 'enrolled' && renderStudentSection(
          "Enrolled Students", 
          enrolledStudents, 
          'enrolledOnly'
        )}

        {activeTab === 'notEnrolled' && renderStudentSection(
          "Not Enrolled Students", 
          notEnrolledStudents, 
          'notEnrolledOnly'
        )}
      </div>
    </div>
  );
}