import api from '@/lib/api'; // Import your custom axios instance

// This interface matches your Django GradeSerializer
export interface Grade {
  id: number;
  student: number; // This is the student's User ID
  student_name: string;
  course: number; // This is the Course ID
  course_name: string;
  grade: string; // e.g., "A+", "B", "95"
  remarks: string;
  date_assigned: string; // This will be an ISO date string
}

// This interface is for CREATING a new grade
// We only need the fields that we have to send
export interface NewGradeData {
  student: number; // The ID of the student
  course: number;  // The ID of the course
  grade: string;
  remarks?: string; // Remarks are optional
}

// This interface is for UPDATING a grade
// All fields are optional when updating
export type UpdateGradeData = Partial<NewGradeData>;


// --- API Functions ---

/**
 * Fetches the list of grades.
 * - Students will get only their own grades.
 * - Teachers/Admins will get all grades (based on your views.py logic).
 */
export const fetchGrades = async (): Promise<Grade[]> => {
  try {
    const response = await api.get<Grade[]>('/api/grades/');
    return response.data;
  } catch (error) {
    console.error("Error fetching grades:", error);
    throw error;
  }
};

/**
 * Creates a new grade. (Teacher/Admin only)
 */
export const createGrade = async (gradeData: NewGradeData): Promise<Grade> => {
  try {
    const response = await api.post<Grade>('/api/grades/', gradeData);
    return response.data;
  } catch (error) {
    console.error("Error creating grade:", error);
    throw error;
  }
};

/**
 * Updates an existing grade. (Teacher/Admin only)
 */
export const updateGrade = async (gradeId: number, gradeData: UpdateGradeData): Promise<Grade> => {
  try {
    // We use PATCH here, as it's better for partial updates
    const response = await api.patch<Grade>(`/api/grades/${gradeId}/`, gradeData);
    return response.data;
  } catch (error) {
    console.error("Error updating grade:", error);
    throw error;
  }
};

/**
 * Deletes a grade. (Teacher/Admin only)
 */
export const deleteGrade = async (gradeId: number): Promise<void> => {
  try {
    await api.delete(`/api/grades/${gradeId}/`);
  } catch (error) {
    console.error("Error deleting grade:", error);
    throw error;
  }
};