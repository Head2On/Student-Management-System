
"use client";

import React, { useState, useEffect } from 'react';
import { CalendarDays, Save, CheckCircle, XCircle } from 'lucide-react';
import { 
  attendanceService, 
  CourseWithStudents, 
  Student, 
  AttendanceRecord 
} from '@/services/attendanceService';

const toYYYYMMDD = (date: Date) => date.toISOString().split('T')[0];

export default function TeacherAttendancePage() {
  const [courses, setCourses] = useState<CourseWithStudents[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]); 
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(toYYYYMMDD(new Date()));
  const [attendance, setAttendance] = useState<Record<number, 'Present' | 'Absent'>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // --- DEBUG LOG 1 ---
  // This tells us what the 'students' state is every time the component re-renders.
  console.log("RENDER - Current students state:", students);

  // 1. Load the teacher's courses on mount
  useEffect(() => {
    setIsLoading(true);
    attendanceService.getTeacherCourses()
      .then(data => {
        // --- DEBUG LOG 2 ---
        // This shows us the raw data from the API. Check if 'students' has data here.
        console.log("API Success - Fetched courses:", data);
        setCourses(data);
        setIsLoading(false);
      })
      .catch(err => {
        setMessage(err.message);
        setIsLoading(false);
      });
  }, []);

  // 2. When course or date changes, fetch attendance for that day
  useEffect(() => {
    if (selectedCourseId && selectedDate) {
      // Find the students for the selected course
      const course = courses.find(c => c.id === parseInt(selectedCourseId));

      // --- DEBUG LOG 3 ---
      // This is the most important log. It tells us what it found.
      console.log("SELECTION - Selected course ID:", selectedCourseId);
      console.log("SELECTION - Found course object:", course);

      if (course) {
        console.log("SELECTION - Setting students to:", course.students);
        setStudents(course.students);
      }
      
      const fetchAttendance = async () => {
        setIsLoading(true);
        try {
          const dateObj = new Date(selectedDate);
          const records = await attendanceService.getAttendanceForDay(
            parseInt(selectedCourseId), 
            dateObj
          );
          setAttendanceRecords(records);
          const newAttendance: Record<number, 'Present' | 'Absent'> = {};
          records.forEach(record => {
            newAttendance[record.student.id] = record.status;
          });
          setAttendance(newAttendance);
          setMessage('');
        } catch (error) {
          console.error("Failed to fetch attendance:", error);
          setMessage(error instanceof Error ? error.message : 'Failed to load attendance');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchAttendance();
    }
  }, [selectedCourseId, selectedDate, courses]);

  // --- Event Handlers (No changes) ---

  const handleStatusChange = (studentId: number, newStatus: 'Present' | 'Absent') => {
    setAttendance(prev => ({ ...prev, [studentId]: newStatus }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedCourseId || !selectedDate) return;
    
    const records = students.map(student => ({
      student_id: student.id,
      status: attendance[student.id] || 'Absent',
    }));

    const data = {
      course_id: parseInt(selectedCourseId),
      date: selectedDate,
      records: records,
    };
    
    setIsLoading(true);
    setMessage('');
    try {
      await attendanceService.saveAttendance(data);
      setMessage('Attendance saved successfully!');
      
      const dateObj = new Date(selectedDate);
      const updatedRecords = await attendanceService.getAttendanceForDay(
        parseInt(selectedCourseId), 
        dateObj
      );
      setAttendanceRecords(updatedRecords);
    } catch (error) {
      console.error("Failed to save attendance:", error);
      setMessage(error instanceof Error ? error.message : 'Failed to save attendance');
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI Calculations (No changes) ---
  const presentCount = Object.values(attendance).filter(s => s === 'Present').length;
  const absentCount = Object.values(attendance).filter(s => s === 'Absent').length;
  const totalStudents = students.length;
  const selectedCourseName = courses.find(c => c.id === parseInt(selectedCourseId))?.name || '...';
  const lastUpdated = attendanceRecords.length > 0 
    ? `Last updated: ${new Date().toLocaleTimeString()}`
    : 'No records found for this date';
  // --- RETURN JSX (No changes) ---
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto font-domine rounded-xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Teacher Attendance Dashboard</h1>
          <p className="text-gray-600">Mark student attendance for your courses</p>
        </div>

        {/* Selection Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 text-black">
          <div className="grid grid-cols-2 gap-6">
            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Course
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="" disabled>Select a course...</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>
          </div>

          {/* Stats */}
          {students.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-600 mb-1">Total Students</p>
                <p className="text-2xl font-bold text-blue-700">{totalStudents}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-600 mb-1">Present</p>
                <p className="text-2xl font-bold text-green-700">{presentCount}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-sm text-red-600 mb-1">Absent</p>
                <p className="text-2xl font-bold text-red-700">{absentCount}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Records</p>
                <p className="text-2xl font-bold text-gray-700">{attendanceRecords.length}</p>
              </div>
            </div>
          )}
          {students.length > 0 && (
            <p className="text-sm text-gray-500 mt-4">{lastUpdated}</p>
          )}
        </div>

        {/* Students Attendance Table */}
        {students.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                Students in {selectedCourseName}
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase">
                      Student Name
                    </th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {student.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{student.username}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-3">
                          {/* Present Button */}
                          <button
                            onClick={() => handleStatusChange(student.id, 'Present')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                              attendance[student.id] === 'Present'
                                ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
                            }`}
                          >
                            <CheckCircle size={18} />
                            <span>Present</span>
                          </button>

                          {/* Absent Button */}
                          <button
                            onClick={() => handleStatusChange(student.id, 'Absent')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                              attendance[student.id] === 'Absent'
                                ? 'bg-red-500 text-white shadow-lg shadow-red-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                            }`}
                          >
                            <XCircle size={18} />
                            <span>Absent</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Save Button */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleSaveAttendance}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                <Save size={20} />
                <span>{isLoading ? 'Saving...' : 'Save Attendance'}</span>
              </button>
              {message && <p className="text-center mt-4 text-sm">{message}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}