import api from '@/lib/api';

// --- Helper: Format date to "YYYY-MM-DD" ---
const toYYYYMMDD = (date: Date) => date.toISOString().split('T')[0];

// --- Interfaces ---
// These types should match the ones in app/attendance/page.tsx

export interface Student {
  id: number;
  username: string;
  email: string;
}

// For GET /api/attendance/teacher/courses/
export interface CourseWithStudents {
  id: number;
  code: string;
  name: string;
  students: Student[];
}

// For GET /api/attendance/student/courses/
export interface StudentCourse {
  id: number;
  code: string;
  name: string;
}

// For GET /api/attendance/teacher/ or /api/attendance/student/
export interface AttendanceRecord {
  id: number;
  student: Student;
  course: number;
  date: string; // "YYYY-MM-DD"
  status: 'Present' | 'Absent';
}

// For POST /api/attendance/teacher/
export interface NewAttendanceData {
  course_id: number;
  date: string; // "YYYY-MM-DD"
  records: {
    student_id: number;
    status: 'Present' | 'Absent';
  }[];
}

// --- API Service Object ---

export const attendanceService = {

  getTeacherCourses: async (): Promise<CourseWithStudents[]> => {
    try {
      const response = await api.get<CourseWithStudents[]>('/api/attendance/teacher/courses/');
      return response.data;
    } catch (error) {
      console.error("Failed to fetch teacher courses:", error);
      throw new Error('Could not load your courses.');
    }
  },

  /**
   * (Teacher) Gets all attendance records for a specific course on a specific date.
   */
  getAttendanceForDay: async (courseId: number, date: Date): Promise<AttendanceRecord[]> => {
    const dateString = toYYYYMMDD(date);
    try {
      const response = await api.get<AttendanceRecord[]>(
        `/api/attendance/teacher/mark/?course_id=${courseId}&date=${dateString}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch attendance records:", error);
      throw new Error('Could not load attendance records.');
    }
  },

  /**
   * (Teacher) Saves a batch of attendance records for a course on a specific date.
   */
  saveAttendance: async (data: NewAttendanceData): Promise<null> => {
    try {
      const response = await api.post('/api/attendance/teacher/mark/', data);
      return response.data;
    } catch (error) {
      console.error("Failed to save attendance:", error);
      throw new Error('Could not save attendance.');
    }
  },

 
  getEnrolledCourses: async (): Promise<StudentCourse[]> => {
    try {
      const response = await api.get<StudentCourse[]>('/api/attendance/student/courses/');
      return response.data;
    } catch (error) {
      console.error("Failed to fetch enrolled courses:", error);
      throw new Error('Could not load your courses.');
    }
  },

  /**
   * (Student) Gets their own attendance history for a single course.
   */
  getMyAttendance: async (courseId: number): Promise<AttendanceRecord[]> => {
    try {
      const response = await api.get<AttendanceRecord[]>(
        `/api/attendance/student/my-attendance/?course_id=${courseId}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch your attendance:", error);
      throw new Error('Could not load your attendance.');
    }
  },
};
