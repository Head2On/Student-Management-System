// src/app/manage-students/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Edit, Trash2, Plus } from 'lucide-react';
import Navbar from "../../../components/navbar";
import { useAuthContext } from "@/context/AuthContext";
import {
  fetchStudents,
  createStudent,
  deleteStudent,
  updateStudent,
  Student,
  NewStudentData,
  UpdateStudentData,
} from "@/services/studentService";

const AccessDenied = () => (
  <div className="p-4 m-4 text-center text-red-600 bg-white rounded-lg">
    <h1 className="text-xl font-bold">Access Denied</h1>
    <p>You do not have permission to view this page. This area is for teachers and admins only.</p>
  </div>
);

export default function ManageStudentsPage() {
  const { user } = useAuthContext();
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const [formState, setFormState] = useState<NewStudentData>({
    username: "",
    email: "",
    roll_number: "",
    course: 0,
    department: "",
    year: new Date().getFullYear(),
    date_of_birth: "",
    phone: "",
    address:"",
    govt_Id:"",
  });

  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateStudentData>({});

  const loadStudents = async () => {
    try {
      setError(null);
      const data = await fetchStudents();
      setStudents(data);
    } catch (err) {
      setError("Failed to load students.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'teacher' || user.role === 'admin')) {
      loadStudents();
    } else if (user) {
      setIsLoading(false);
    }
  }, [user]);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formState.course === 0) {
      setError("Please enter a valid Course ID.");
      return;
    }
  const currentYear = new Date().getFullYear();
    if (formState.year < 1950 || formState.year > currentYear + 5) {
      setError(`Please enter a valid Year (e.g., ${currentYear}).`);
      return;
    }

    try {
      setError(null);
      await createStudent(formState);
      
      setFormState({
        username: "", email: "", roll_number: "",
        course: 0, department: "", year: new Date().getFullYear(), date_of_birth: "",phone:"",
        address:"", govt_Id:"",
      });
      setShowAddForm(false);
      loadStudents();
    } catch (err: unknown) {
      console.error(err);
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const resErr = err as { response?: { data?: { detail?: string } } };
        setError(resErr.response?.data?.detail || "Failed to create student.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create student.");
      }
    }
  };

  const handleDeleteStudent = async (studentId: number) => {
    if (window.confirm("Are you sure you want to delete this student? This will also delete their user account.")) {
      try {
        setError(null);
        await deleteStudent(studentId);
        loadStudents();
      } catch (err: unknown) {
        console.error(err);
        if (typeof err === 'object' && err !== null && 'response' in err) {
          const resErr = err as { response?: { data?: { detail?: string } } };
          setError(resErr.response?.data?.detail || "Failed to delete student.");
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to delete student.");
        }
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleEditClick = (student: Student) => {
    setEditingStudentId(student.id);
    setEditFormData({
      user_username:student.user_username,
      user_email:student.user_email,
      roll_number: student.roll_number,
      course: student.course,
      department: student.department,
      year: student.year,
      date_of_birth: student.date_of_birth,
      phone:student.phone,
      address:student.address,
      govt_Id:student.govt_Id,
    });
  };

  const handleCancelClick = () => {
    setEditingStudentId(null);
    setEditFormData({});
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleUpdateStudent = async (studentId: number) => {
    try {
    setError(null);
    const dataToUpdate: UpdateStudentData = { ...editFormData };
    delete dataToUpdate.user_username;
    delete dataToUpdate.user_email;

    await updateStudent(studentId, dataToUpdate); 

    setEditingStudentId(null);
    loadStudents();
    } catch (err: unknown) {
      console.error(err);
      if (typeof err === "object" && err !== null && "response" in err) {
        const resErr = err as { response?: { data?: { detail?: string } } };
        setError(resErr.response?.data?.detail || "Failed to update student.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update student.");
      }
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student => {
    const term = searchTerm.toLowerCase();

    // Use the new field names and check if they exist
    return (student.user_username && student.user_username.toLowerCase().includes(term)) ||
           (student.user_email && student.user_email.toLowerCase().includes(term)) || 
           (student.Student_Id && student.Student_Id.toLowerCase().includes(term)) ||
           (student.govt_Id && student.govt_Id.toUpperCase().includes(term));
  });

  if (isLoading) {
    return (
      <section>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen font-domine">
          <div className="text-lg">Loading...</div>
        </div>
      </section>
    );
  }

  if (!user || user.role === 'student') {
    return (
      <section>
        <Navbar />
        <AccessDenied />
      </section>
    );
  }

  return (

      <div className="min-h-screen bg-orange-50 p-8">
        <div className="max-w-7xl mx-auto font-domine">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Students</h1>
            <p className="text-gray-600">View and manage all student accounts</p>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600">Entries</span>
              </div>
              
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                Add Student
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800" size={18} />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
          </div>

          {/* Add Student Form */}
          {showAddForm && (
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Student</h2>
              {error && <p className="mb-4 text-red-500 text-sm">{error}</p>}
              <form onSubmit={handleCreateStudent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-black gap-4">
                <input name="username" placeholder="Username" value={formState.username} onChange={handleFormChange} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input name="email" type="email" placeholder="Email" value={formState.email} onChange={handleFormChange} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input name="course" type="number" placeholder="Course ID" value={formState.course} onChange={handleFormChange} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input name="department" placeholder="Department" value={formState.department} onChange={handleFormChange} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input name="year" type="number" placeholder="Year" value={formState.year} onChange={handleFormChange} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input name="date_of_birth" type="date" placeholder="Date of Birth" value={formState.date_of_birth} onChange={handleFormChange} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input name="address" placeholder="Permanent Address" value={formState.address} onChange={handleFormChange} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input name="phone" placeholder="Mobile number" value={formState.phone} onChange={handleFormChange} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input name="govt_Id" placeholder="Aadhaar or any Govt ID" value={formState.govt_Id} onChange={handleFormChange} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <div className="flex gap-2">
                  <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Create Student
                  </button>
                  <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Students Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase">Student Name</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase">Email</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase">Roll</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase">Course</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase">Department</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase">Year</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 text-black transition-colors">
                    {editingStudentId === student.id ? (
                      // Editing Row
                      <>
                        <td className="py-4 px-6">
                          {editFormData.user_username}
                        </td> 
                        <td className="py-4 px-6">
                         {editFormData.user_email}
                        </td>
                        <td className="py-4 px-6">
                          {editFormData.roll_number}
                        </td>
                        <td className="py-4 px-6">
                          <input
                            name="course"
                            type="number"
                            value={editFormData.course}
                            onChange={handleEditFormChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <input
                            name="department"
                            value={editFormData.department || ''}
                            onChange={handleEditFormChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <input
                            name="year"
                            type="number"
                            value={editFormData.year || new Date().getFullYear()}
                            onChange={handleEditFormChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleUpdateStudent(student.id)}
                              className="px-4 py-2 bg-green-600 text-black rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelClick}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      // Normal Row
                      <>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="font-semibold text-blue-600">
                                {student.user_username ? student.user_username.charAt(0).toUpperCase() : '?'}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{student.user_username}</p>
                              <p className="text-sm text-gray-500">ID: {student.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-700">{student.user_email}</td>
                        <td className="py-4 px-6 text-gray-700">{student.Student_Id}</td>
                        <td className="py-4 px-6 text-gray-700">
                          {student.course_name} (ID: {student.course})
                        </td>
                        <td className="py-4 px-6 text-gray-700">{student.department}</td>
                        <td className="py-4 px-6 text-gray-700">{student.year}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditClick(student)}
                              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            {user?.role === 'admin' && (
                              <button
                                onClick={() => handleDeleteStudent(student.id)}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
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

          {/* Footer */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Showing {filteredStudents.length} of {students.length} students
            </p>

            {/* Pagination */}
            <div className="flex items-center gap-2">
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <ChevronLeft size={18} className="text-gray-600" />
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
                2
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
                3
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <ChevronRight size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    
  );
}