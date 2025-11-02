// src/services/studentService.ts
import api from '@/lib/api';
import axios from 'axios';

// src/services/studentService.tsx

// 1. This is the data we RECEIVE from the server (for the table)
// It has the read-only user_username and user_email.
export interface Student {
  id: number;
  user_username: string; // The User's username
  user_email: string;  // The User's email
  Student_Id: string;    // The read-only field from roll_number
  roll_number: string; // The actual database field
  course: number;
  course_name: string;
  department: string;
  year: number;
  date_of_birth: string;
  address: string;
  phone: string;
  govt_Id: string;
}

// 2. This is the data we SEND to the server (for the "Add Student" form)
// It has the write-only username and email.
export interface NewStudentData {
  username: string;
  email: string;
  roll_number: string; // We send roll_number
  course: number;
  department: string;
  year: number;
  date_of_birth: string;
  address: string;
  phone: string;
  govt_Id: string;
}

// 3. This is the data for the "Edit" form state and update (PATCH)
export interface UpdateStudentData {
  roll_number?: string; // We can update roll_number
  course?: number;
  department?: string;
  year?: number;
  date_of_birth?: string;
  address?: string;
  phone?: string;
  govt_Id?: string;
  
  // These are for the form's display, but we delete them before sending
  user_username?: string;
  user_email?: string;
}

// ... rest of your file is fine ...
export const fetchStudents = async (): Promise<Student[]> => {
  try {
    const response = await api.get<Student[]>('/api/students/');
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const createStudent = async (studentData: NewStudentData): Promise<Student> => {
  try {
    const response = await api.post<Student>('/api/students/', studentData);
    return response.data;
  }catch (error) {
  console.error('Error creating student (Full Error):', error);

  // This is the important part
  if (axios.isAxiosError(error) && error.response) {
    console.error('Validation Errors:', error.response.data);
  }
  throw error;
}
};


export const updateStudent = async (id: number, studentData: UpdateStudentData): Promise<Student> => {
  try {
    const response = await api.patch<Student>(`/api/students/${id}/`, studentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating student ${id}:`, error);
    throw error;
  }
};

export const deleteStudent = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/students/${id}/`);
  } catch (error) {
    console.error(`Error deleting student ${id}:`, error);
    throw error;
  }
};

/**
 * Fetches a single student by their ID.
 */
export const getStudentById = async (id: number): Promise<Student> => {
  try {
    const response = await api.get<Student>(`/api/students/${id}/`);
    return response.data;
  } catch (error){
    console.error(`Error fetching student ${id}:`, error);
    throw error;
  }
};