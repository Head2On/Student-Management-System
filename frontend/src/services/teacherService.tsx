// src/services/teacherService.ts
import api from '@/lib/api';


// --- Interfaces (These are all correct) ---
export interface Teacher {
  id: number;
  username: string;
  email: string;
  employee_id: string;
  department: string;
  specialization: string;
}
export interface NewTeacherData {
  username: string;
  email: string;
  password?: string;
  employee_id: string;
  department: string;
  specialization: string;
}
export interface UpdateTeacherData {
  employee_id?: string;
  department?: string;
  specialization?: string;
}

// --- API Functions ---

export const fetchTeachers = async (): Promise<Teacher[]> => {
  try {
    const response = await api.get<Teacher[]>('/api/teachers/');
    return response.data;
  } catch (error) {
    console.error('Error fetching teachers:', error);
    // 1. RE-THROW THE ORIGINAL ERROR
    throw error;
  }
};

export const createTeacher = async (teacherData: NewTeacherData): Promise<Teacher> => {
  try {
    const response = await api.post<Teacher>('/api/teachers/', teacherData);
    return response.data;
  } catch (error) {
    console.error('Error creating teacher:', error);
    // 2. RE-THROW THE ORIGINAL ERROR
    throw error;
  }
};

export const updateTeacher = async (teacherId: number, updateData: UpdateTeacherData): Promise<Teacher> => {
  try {
    const response = await api.patch<Teacher>(`/api/teachers/${teacherId}/`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating teacher ${teacherId}:`, error);
    // 3. RE-THROW THE ORIGINAL ERROR
    throw error;
  }
};

export const deleteTeacher = async (teacherId: number): Promise<void> => {
  try {
    await api.delete(`/api/teachers/${teacherId}/`);
  } catch (error) {
    console.error(`Error deleting teacher ${teacherId}:`, error);
    // 4. RE-THROW THE ORIGINAL ERROR
    throw error;
  }
};