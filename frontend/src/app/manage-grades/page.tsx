// src/app/manage-grades/page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "../../../components/navbar"; // Assuming navbar is here
import { useAuthContext } from "@/context/AuthContext";
import {
  fetchGrades,
  createGrade,
  deleteGrade,
  updateGrade, // 1. Import updateGrade
  Grade,
  NewGradeData,
  UpdateGradeData, // 2. Import the UpdateGradeData type
} from "@/services/gradeService";

// This is a simple component for the "Access Denied" message
const AccessDenied = () => (
  <div className="p-4 m-4 text-center text-red-600 bg-red-100 rounded-lg">
    <h1 className="text-xl font-bold">Access Denied</h1>
    <p>You do not have permission to view this page. This area is for teachers and admins only.</p>
  </div>
);

// This is the main component for the page
export default function ManageGradesPage() {
  const { user } = useAuthContext(); // Get the user's role
  const [grades, setGrades] = useState<Grade[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // State for the new grade form
  const [newGradeStudentId, setNewGradeStudentId] = useState("");
  const [newGradeCourseId, setNewGradeCourseId] = useState("");
  const [newGradeValue, setNewGradeValue] = useState("");
  const [newGradeRemarks, setNewGradeRemarks] = useState("");

  // 3. State for the EDITING functionality
  const [editingGradeId, setEditingGradeId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateGradeData>({
    grade: "",
    remarks: "",
  });

  // Function to load grades from the API
  const loadGrades = async () => {
    try {
      const data = await fetchGrades();
      setGrades(data);
    } catch (err) {
      setError("Failed to load grades.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load grades when the component mounts (if user is authorized)
  useEffect(() => {
    if (user && (user.role === 'teacher' || user.role === 'admin')) {
      loadGrades();
    }
  }, [user]);

  // Handler for the create grade form
  const handleCreateGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const gradeData: NewGradeData = {
      student: parseInt(newGradeStudentId, 10),
      course: parseInt(newGradeCourseId, 10),
      grade: newGradeValue,
      remarks: newGradeRemarks,
    };

    try {
      await createGrade(gradeData);
      // Reset form and reload grades
      setNewGradeStudentId("");
      setNewGradeCourseId("");
      setNewGradeValue("");
      setNewGradeRemarks("");
      loadGrades(); // Refresh the list
    } catch (err: Error | unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to create grade.");
    }
  };

  // Handler for deleting a grade
  const handleDeleteGrade = async (gradeId: number) => {
    if (window.confirm("Are you sure you want to delete this grade?")) {
      try {
        await deleteGrade(gradeId);
        loadGrades(); // Refresh the list
      } catch (err: Error | unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to delete grade.");
      }
    }
  };
  
  // --- 4. NEW HANDLERS FOR EDITING ---

  // When "Edit" button is clicked
  const handleEditClick = (grade: Grade) => {
    setEditingGradeId(grade.id);
    setEditFormData({ grade: grade.grade, remarks: grade.remarks });
  };

  // When "Cancel" button is clicked
  const handleCancelClick = () => {
    setEditingGradeId(null);
    setEditFormData({ grade: "", remarks: "" });
  };

  // When typing in the edit form inputs
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // When "Save" button is clicked
    const handleUpdateGrade = async (gradeId: number) => {
      try {
        await updateGrade(gradeId, editFormData);
        setEditingGradeId(null); // Exit edit mode
        loadGrades(); // Refresh the list
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === "object" && err !== null) {
          const maybeAxiosError = err as { response?: { data?: { detail?: string } } };
          setError(maybeAxiosError.response?.data?.detail || "Failed to update grade.");
        } else {
          setError("Failed to update grade.");
        }
      }
    };


  // --- Render Logic (unchanged from here up) ---

  if (isLoading && !user) {
    return (
      <section>
        <Navbar />
        <div className="p-4 text-center">Loading...</div>
      </section>
    );
  }

  if (user && user.role === 'student') {
    return (
      <section>
        <Navbar />
        <AccessDenied />
      </section>
    );
  }

  return (
    <section>
      <div className="container p-4 mx-auto">
        <h1 className="mb-4 text-2xl font-bold">Manage Grades</h1>

        {/* --- Create Grade Form (unchanged) --- */}
        <form onSubmit={handleCreateGrade} className="p-4 mb-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-2 text-xl font-semibold">Add New Grade</h2>
          {error && <p className="mb-2 text-red-500">{error}</p>}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <input
              type="number"
              placeholder="Student ID"
              value={newGradeStudentId}
              onChange={(e) => setNewGradeStudentId(e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Course ID"
              value={newGradeCourseId}
              onChange={(e) => setNewGradeCourseId(e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Grade (e.g., A+)"
              value={newGradeValue}
              onChange={(e) => setNewGradeValue(e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Remarks (Optional)"
              value={newGradeRemarks}
              onChange={(e) => setNewGradeRemarks(e.target.value)}
              className="p-2 border rounded"
            />
          </div>
          <button type="submit" className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700">
            Add Grade
          </button>
        </form>

        {/* --- 5. UPDATED Grades List --- */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Student</th>
                <th className="px-4 py-2 text-left">Course</th>
                <th className="px-4 py-2 text-left">Grade</th>
                <th className="px-4 py-2 text-left">Remarks</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade.id} className="border-t">
                  {editingGradeId === grade.id ? (
                    // --- This is the EDITING ROW ---
                    <>
                      <td className="px-4 py-2">{grade.student_name}</td>
                      <td className="px-4 py-2">{grade.course_name}</td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          name="grade"
                          value={editFormData.grade}
                          onChange={handleEditFormChange}
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          name="remarks"
                          value={editFormData.remarks}
                          onChange={handleEditFormChange}
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleUpdateGrade(grade.id)}
                          className="px-2 py-1 mr-2 text-white bg-green-500 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelClick}
                          className="px-2 py-1 text-white bg-gray-500 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    // --- This is the NORMAL (Read-Only) ROW ---
                    <>
                      <td className="px-4 py-2">{grade.student_name} (ID: {grade.student})</td>
                      <td className="px-4 py-2">{grade.course_name} (ID: {grade.course})</td>
                      <td className="px-4 py-2">{grade.grade}</td>
                      <td className="px-4 py-2">{grade.remarks}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleEditClick(grade)}
                          className="px-2 py-1 mr-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteGrade(grade.id)}
                          className="px-2 py-1 text-white bg-red-600 rounded hover:bg-red-700"
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