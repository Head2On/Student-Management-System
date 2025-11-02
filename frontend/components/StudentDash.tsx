'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Trophy, Users, ArrowRight } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  delay?: number;
}

interface CourseCardProps {
  course: {
    id: number;
    name: string;
    code: string;
    instructor: string;
    progress: number;
    nextClass: string;
  };
  delay?: number;
}

const StudentDashboard = () => {
  const { user } = useAuthContext();

  const studentData = {
    name: user ? user.username : 'Student',
    totalCourses: 4,
    attendance: 85,
    gpa: 3.6,
    courses: [
      {
        id: 1,
        name: "Computer Science 101",
        code: "CS101",
        instructor: "Dr. Smith",
        progress: 75,
        nextClass: "Mon 10:00 AM"
      },
      {
        id: 2,
        name: "Mathematics",
        code: "MATH202",
        instructor: "Prof. Johnson",
        progress: 60,
        nextClass: "Tue 2:00 PM"
      },
    ],
    recentGrades: [
      { course: "CS101", grade: "A", points: 4.0, assignment: "Final Project" },
      { course: "MATH202", grade: "B+", points: 3.3, assignment: "Midterm" },
    ],
    announcements: [
      {
        id: 1,
        title: "Midterm Exams",
        date: "March 10, 2025",
        message: "Midterm exams will start next Monday. Please check your course schedule."
      },
    ]
  };

  const StatsCard = ({ icon: Icon, title, value, delay = 0 }: StatsCardProps) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </motion.div>
  );

  const CourseCard = ({ course, delay = 0 }: CourseCardProps) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-gray-900 font-semibold text-lg mb-1">{course.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{course.code} • {course.instructor}</p>
        </div>
        <BookOpen className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{course.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div>
          <p className="text-gray-500 text-xs mb-1">Next Class</p>
          <p className="text-gray-900 text-sm font-medium">{course.nextClass}</p>
        </div>
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
          View <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );

  const QuickAction = ({ icon: Icon, text, delay = 0 }: { icon: React.ElementType, text: string, delay?: number }) => (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 text-left group hover:border-blue-200"
    >
      <div className="bg-blue-50 p-2 rounded-lg w-fit mb-3 group-hover:bg-blue-100 transition-colors">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <span className="text-gray-700 font-medium text-sm">{text}</span>
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-15">
            Welcome back, {user ? user.username : 'Student'}
          </h1>
          <p className="text-gray-600">
            Here&apos;s your academic overview for today
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatsCard
            icon={BookOpen}
            title="Total Courses"
            value={studentData.totalCourses}
            delay={0.1}
          />
          <StatsCard
            icon={Calendar}
            title="Attendance"
            value={`${studentData.attendance}%`}
            delay={0.2}
          />
          <StatsCard
            icon={Trophy}
            title="Current GPA"
            value={studentData.gpa}
            delay={0.3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Courses Section */}
          <div className="lg:col-span-2">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl font-semibold text-gray-900 mb-4"
            >
              Your Courses
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentData.courses.map((course, index) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  delay={0.5 + index * 0.1}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Grades */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Grades</h3>
              <div className="space-y-3">
                {studentData.recentGrades.map((grade, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-gray-900 font-medium text-sm">{grade.course}</p>
                      <p className="text-gray-500 text-xs">{grade.assignment}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900 font-bold">{grade.grade}</p>
                      <p className="text-gray-500 text-xs">{grade.points}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <QuickAction icon={BookOpen} text="All Courses" delay={0.8}/>
                <QuickAction icon={Calendar} text="Attendance" delay={0.9} />
                <QuickAction icon={Trophy} text="Grades" delay={1.0} />
                <QuickAction icon={Users} text="Study Groups" delay={1.1} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="bg-transparent rounded-xl p-5 shadow-sm border border-gray-800"
        >
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;