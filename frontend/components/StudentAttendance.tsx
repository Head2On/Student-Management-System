'use client'

import React, { useState, useEffect } from 'react';
// Imports for shadcn/ui Select
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Imports for the circle
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
// Imports from your service
import { attendanceService, StudentCourse, AttendanceRecord } from '@/services/attendanceService';

// (We've removed the unused imports like CalendarIcon, Check, X, etc.)

// --- This part is for the ProfileCard.tsx ---
interface AttendanceStats {
  totalPresent: number;
  totalAbsent: number;
}
interface StudentAttendanceViewProps {
  onDataLoaded: (stats: AttendanceStats) => void;
}
// ------------------------------------------

export const StudentAttendanceView: React.FC<StudentAttendanceViewProps> = ({ onDataLoaded }) => {
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [message, setMessage] = useState('');
  
  // State to hold the calculated percentage
  const [percentage, setPercentage] = useState(0);

  // 1. Load courses student is enrolled in (Unchanged)
  useEffect(() => {
    attendanceService.getEnrolledCourses()
      .then(setCourses)
      .catch(() => setMessage("Could not load your courses. Please try again."));
  }, []); //

  // 2. When course changes, fetch attendance and calculate stats
  useEffect(() => {
    if (selectedCourseId) {
      setMessage('');
      attendanceService.getMyAttendance(parseInt(selectedCourseId))
        .then(records => {
          let totalPresent = 0;
          let totalAbsent = 0;

          // Calculate stats
          for (const record of records) {
            if (record.status === 'Present') { //
              totalPresent++;
            } else if (record.status === 'Absent') {
              totalAbsent++;
            }
          }
          
          const totalRecords = totalPresent + totalAbsent;
          
          // Calculate percentage
          const newPercentage = totalRecords === 0 ? 0 : Math.round((totalPresent / totalRecords) * 100); //
          setPercentage(newPercentage);
          
          // Send stats up to the ProfileCard
          onDataLoaded({ totalPresent, totalAbsent });
        })
        .catch(() => setMessage("Could not load attendance for this course."));
    } else {
      // Reset stats if no course is selected
      onDataLoaded({ totalPresent: 0, totalAbsent: 0 });
      setPercentage(0);
    }
  }, [selectedCourseId, onDataLoaded]); //

  return (
    // This container holds the new component
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 font-domine">
      
      {/* Header and Course Selection (Simplified from your file) */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Attendance</h1>
          <p className="text-gray-600 text-sm">Track your class attendance records</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Select Course</label>
          <Select onValueChange={setSelectedCourseId} value={selectedCourseId}>
            <SelectTrigger className="w-full h-12 border-2 hover:border-blue-400 transition-colors">
              <SelectValue placeholder="Choose a course to view your attendance..." />
            </SelectTrigger>
            <SelectContent>
              {courses.length === 0 && (
                <SelectItem value="none" disabled>No courses found</SelectItem>
              )}
              {courses.map(course => (
                <SelectItem key={course.id} value={String(course.id)}>
                  <span className="font-medium">{course.name}</span>
                  <span className="text-gray-500 ml-2">({course.code})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Error Message */}
        {message && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {message}
          </div>
        )}
      </div>

      {/* --- REPLACEMENT FOR CALENDAR --- */}
      {selectedCourseId ? (
        // Show the circle if a course is selected
        <div className="flex justify-center p-8" style={{ width: 220, height: 220, margin: 'auto' }}>
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({
              // Colors
              textColor: '#1f2937', // gray-800
              pathColor: percentage > 75 ? '#10b981' : percentage >= 50 ? '#F59527' : '#F53127', // green, amber, red
              trailColor: '#e5e7eb', // gray-200

              // Typography
              textSize: '24px',
            })}
          />
        </div>
      ) : (
        // Show the "Select Course" message if no course is selected
        <div className="text-center p-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a Course</h3>
          <p className="text-gray-600">Choose a course to view your attendance percentage.</p>
        </div>
      )}
      {/* --- END OF REPLACEMENT --- */}

    </div>
  );
};

export default StudentAttendanceView;