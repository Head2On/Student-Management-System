// src/app/manage-teachers/page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "../../../components/navbar"; // Adjust path if needed
import { useAuthContext } from "@/context/AuthContext";
import {
  fetchTeachers,
  createTeacher,
  deleteTeacher,
  updateTeacher,
  Teacher,
  NewTeacherData,
  UpdateTeacherData,
} from "@/services/teacherService"; // 1. Import from teacherService

// This is a simple component for the "Access Denied" message
const AccessDenied = () => (
  <div className="p-4 m-4 text-center text-red-600 bg-red-100 rounded-lg">
    <h1 className="text-xl font-bold">Access Denied</h1>
    <p>You do not have permission to view this page. This area is for admins only.</p>
  </div>
);

export default function ManageTeachersPage() {
  const { user } = useAuthContext();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. State for the new teacher form
  const [formState, setFormState] = useState<NewTeacherData>({
    username: "",
    email: "",
    password: "",
    employee_id: "",
    department: "",
    specialization: "",
  });

  // 3. State for editing
  const [editingTeacherId, setEditingTeacherId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateTeacherData>({});

  // Function to load teachers from the API
  const loadTeachers = async () => {
    try {
      setError(null);
      const data = await fetchTeachers();
      setTeachers(data);
    } catch (err) {
      setError("Failed to load teachers.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load teachers when the component mounts (if user is admin)
  useEffect(() => {
    if (user && user.role === 'admin') {
      loadTeachers();
    } else if (user) {
      setIsLoading(false); // User is loaded but not authorized
    }
  }, [user]);

  // Handler for the create teacher form
 // in src/app/manage-teachers/page.tsx

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await createTeacher(formState);
      
      // Reset form
      setFormState({
        username: "", email: "", password: "",
        employee_id: "", department: "", specialization: "",
      });

      loadTeachers(); // Refresh the list

    } catch (err: unknown) { // <-- Kept your 'unknown' type
      console.error("Full error response:", err);

      // 1. Replaced 'any' with 'Record<string, unknown>'
      const axiosError = err as { response?: { data?: Record<string, unknown> } };
      const errorData = axiosError.response?.data;

      if (errorData) {
        // 2. Safely check if 'detail' exists and is a string
        if (typeof errorData.detail === 'string') {
          setError(errorData.detail);
        } else {
          // 3. Handle the object of field-specific errors
          try {
            const fieldErrors = Object.keys(errorData)
              .map(key => {
                const errorValue = errorData[key];
                // Check if the value is an array (Django's error format)
                if (Array.isArray(errorValue)) {
                  // Join the array of error messages for that field
                  return `${key}: ${errorValue.join(', ')}`;
                }
                // Handle non-array error values
                return `${key}: ${String(errorValue)}`;
              })
              .join(' | '); // Joins all errors into one string
            setError(fieldErrors || "Failed to create teacher. Check all fields.");
          } catch (parseError) {
            // Fallback if errorData is not an object
            setError("Failed to parse error response. Check console.");
          }
        }
      } else {
        // This catches network errors or other unexpected issues
        setError("Failed to create teacher. An unexpected error occurred.");
      }
    }
  };

  // Handler for deleting a teacher
  const handleDeleteTeacher = async (teacherId: number) => {
    if (window.confirm("Are you sure you want to delete this teacher? This will also delete their user account.")) {
      try {
        setError(null);
        await deleteTeacher(teacherId);
        loadTeachers(); // Refresh the list
      } catch (err: unknown) {
        console.error(err);
        const resErr = err as { response?: { data?: { detail?: string } } };
        setError(resErr.response?.data?.detail || "Failed to delete teacher.");
    }
    }
  };

  // Handler for form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- Handlers for Editing ---
  const handleEditClick = (teacher: Teacher) => {
    setEditingTeacherId(teacher.id);
    // Pre-fill edit form
    setEditFormData({
      employee_id: teacher.employee_id,
      department: teacher.department,
      specialization: teacher.specialization,
    });
  };

  const handleCancelClick = () => {
    setEditingTeacherId(null);
    setEditFormData({});
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateTeacher = async (teacherId: number) => {
    try {
      setError(null);
      await updateTeacher(teacherId, editFormData);
      setEditingTeacherId(null); // Exit edit mode
      loadTeachers(); // Refresh the list
    } catch (err: unknown) {
      console.error(err);
      const resErr = err as { response?: { data?: { detail?: string } } };
      setError(resErr.response?.data?.detail || "Failed to update teacher.");
    }
  };

  // --- Render Logic ---
  if (isLoading) {
    return (
      <section>
        <Navbar />
        <div className="p-4 text-center">Loading...</div>
      </section>
    );
  }

  // 4. Security Check: Only admins can see this page
  if (!user || user.role !== 'admin') {
    return (
      <section>
        <Navbar />
        <AccessDenied />
      </section>
    );
  }

return (
    <section className="bg-amber-200">
      <div className="container p-4 mx-auto">
        <h1 className="mb-4 text-2xl font-bold mt-15">Manage Teachers</h1>

        {/* --- Create Teacher Form --- */}
        <form onSubmit={handleCreateTeacher} className="p-4 mb-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-2 text-xl font-semibold">Add New Teacher</h2>
          {error && <p className="mb-2 text-red-500">{error}</p>}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <input name="username" placeholder="Username" value={formState.username} onChange={handleFormChange} className="p-2 border rounded" required />
            <input name="email" type="email" placeholder="Email" value={formState.email} onChange={handleFormChange} className="p-2 border rounded" required />
            <input name="password" type="password" placeholder="Password (optional)" value={formState.password} onChange={handleFormChange} className="p-2 border rounded" />
            <input name="employee_id" placeholder="Employee ID" value={formState.employee_id} onChange={handleFormChange} className="p-2 border rounded" required />
            <input name="department" placeholder="Department" value={formState.department} onChange={handleFormChange} className="p-2 border rounded" required />
            <input name="specialization" placeholder="Specialization" value={formState.specialization} onChange={handleFormChange} className="p-2 border rounded" required />
          </div>
          <button type="submit" className="px-4 py-2 mt-4 text-white bg-black font-semibold rounded-full hover:bg-blue-700">
            Add Teacher
          </button>
        </form>

        {/* --- Teachers List --- */}
        <div className="overflow-x-auto bg-blue-100 rounded-lg shadow-md">
          <table className="min-w-full">
            <thead className="bg-sky-400">
              <tr>
                <th className="px-4 py-2 text-left">Username (ID)</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Employee ID</th>
                <th className="px-4 py-2 text-left">Department</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="border-t">
                  {editingTeacherId === teacher.id ? (
                    // --- Editing Row ---
                    <>
                      <td className="px-4 py-2">{teacher.username} ({teacher.id})</td>
                      <td className="px-4 py-2">{teacher.email}</td>
                      <td className="px-4 py-2">
                        <input 
                          name="employee_id" 
                          value={editFormData.employee_id || ""} 
                          onChange={handleEditFormChange} 
                          className="w-full p-1 border rounded" 
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          name="department" 
                          value={editFormData.department || ""} 
                          onChange={handleEditFormChange} 
                          className="w-full p-1 border rounded" 
                        />
                      </td>
                      <td className="px-4 py-2">
                        <button 
                          onClick={() => handleUpdateTeacher(teacher.id)} 
                          className="px-2 py-1 mr-2 text-white bg-green-500 rounded-full hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button 
                          onClick={handleCancelClick} 
                          className="px-2 py-1 text-white bg-gray-500 rounded-full hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    // --- Normal Row ---
                    <>
                      <td className="px-4 py-2">{teacher.username} (ID: {teacher.id})</td>
                      <td className="px-4 py-2">{teacher.email}</td>
                      <td className="px-4 py-2">{teacher.employee_id}</td>
                      <td className="px-4 py-2">{teacher.department}</td>
                      <td className="px-4 py-2">
                        <button 
                          onClick={() => handleEditClick(teacher)} 
                          className="px-2 py-1 mr-2 text-white bg-black rounded-full hover:bg-green-600"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteTeacher(teacher.id)} 
                          className="px-2 py-1 text-white bg-red-600 rounded-full hover:bg-orange-600"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}