import api from '@/lib/api';

// 1. Course interface (no change)
export interface Course {
  id: number; 
  code: string;
  name: string;
  description: string;
  teacher_name: string;
  image: string;
  price:number;
  status:string;
}

// 2. NewCourseData interface (image is now a File)
export interface NewCourseData {
  code: string;
  name: string;
  description: string;
  teacher: number;
  image: File | null; 
  price:number;
  status:string;
}

export type UpdateCourseData = Partial<NewCourseData>;

export interface Teacher {
  id: number;
  username: string;
}

export const fetchCourses = async (): Promise<Course[]> => {
  try {
    const response = await api.get<Course[]>('/api/courses/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    throw new Error('Could not retrieve courses.');
  }
};

export const fetchTeachers = async (): Promise<Teacher[]> => {
  try {
    const response = await api.get<Teacher[]>('/api/users/teachers/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch teachers:', error);
    throw new Error('Could not retrieve teachers.');
  }
};

// --- THIS IS THE CORRECTED FUNCTION ---
/**
 * Creates a new course (Teacher/Admin only)
 */
export const createCourse = async (courseData: NewCourseData): Promise<Course> => {
  // We must send FormData for file uploads
  const formData = new FormData();

  formData.append('code', courseData.code);
  formData.append('name', courseData.name);
  formData.append('description', courseData.description);
  formData.append('teacher', courseData.teacher.toString()); // Convert number to string
  
  if (courseData.image) {
    formData.append('image', courseData.image);
  }

  try {
    // Send the formData. We must also override the default 'Content-Type'
    // header so the browser can set the 'multipart/form-data' boundary.
    const response = await api.post<Course>('/api/courses/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create course:', error);
    // This is the error you are seeing in the console
    throw new Error('Could not create the course.');
  }
};
// --- END OF CORRECTED FUNCTION ---

export const getCourseById = async (courseId: number): Promise<Course> => {
  try {
    const response = await api.get<Course>(`/api/courses/${courseId}/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch course with ID ${courseId}:`, error);
    throw new Error('Could not retrieve the specified course.');
  }
};

export const updateCourse = async (courseId: number, updateData: UpdateCourseData): Promise<Course> => {
  try {
    // Note: Updating files also requires FormData.
    const response = await api.patch<Course>(`/api/courses/${courseId}/`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update course with ID ${courseId}:`, error);
    throw new Error('Could not update the course.');
  }
};

export const deleteCourse = async (courseId: number): Promise<void> => {
  try {
    await api.delete(`/api/courses/${courseId}/`);
  } catch (error) {
    console.error(`Failed to delete course with ID ${courseId}:`, error);
    throw new Error('Could not delete the course.');
  }
};