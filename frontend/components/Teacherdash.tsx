'use client';
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { BookOpen, Calendar, Users, GraduationCap, ClipboardCheck, FilePlus } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import Link from 'next/link';
// --- TYPE DEFINITIONS ---
interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  subtitle?: string;
  delay?: number;
}

interface TeacherCourse {
  id: number;
  name: string;
  code: string;
  studentCount: number;
  nextClass: string;
}

interface CourseCardProps {
  course: TeacherCourse;
  delay?: number;
}

interface ActionButtonProps {
  text: string;
  icon: React.ElementType;
  delay?: number;
}

// --- MAIN COMPONENT ---
const TeacherDashboard = () => {
  const { user } = useAuthContext();
  const teacherData = {
    name: user ? user.username : "Professor",
    totalCourses: 2,
    totalStudents: 60,
    avgAttendance: 88,
    courses: [
      {
        id: 1,
        name: "Physics 101",
        code: "PHY101",
        studentCount: 60,
        nextClass: "Tue 9:00 AM"
      },
    ],
    students: [
        { id: 1, name: "Alice Johnson", rollNo: "STU-001", attendance: 95 },
    ]
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // --- REUSABLE COMPONENTS ---
  const StatsCard = ({ icon: Icon, title, value, subtitle, delay = 0 }: StatsCardProps) => (
    <motion.div
      variants={itemVariants}
      transition={{ delay }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/70 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-white/60 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className="bg-white/20 p-3 rounded-xl">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const CourseCard = ({ course, delay = 0 }: CourseCardProps) => (
    <motion.div
      variants={itemVariants}
      transition={{ delay }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-white font-semibold text-lg">{course.name}</h3>
          <p className="text-white/70 text-sm">{course.code}</p>
        </div>
        <div className="bg-white/20 p-2 rounded-lg">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="flex justify-between items-center text-white/80 border-t border-white/20 pt-4 mt-4">
        <div>
          <p className="text-xs">Students Enrolled</p>
          <p className="font-semibold text-white">{course.studentCount}</p>
        </div>
        <div>
          <p className="text-xs text-right">Next Class</p>
          <p className="font-semibold text-white">{course.nextClass}</p>
        </div>
      </div>
    </motion.div>
  );

  const ActionButton = ({ icon: Icon, text, delay = 0 }: ActionButtonProps) => (
    <motion.button
      variants={itemVariants}
      transition={{ delay }}
      className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 rounded-xl px-6 py-3 text-white font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2"
    >
      <Icon className="w-4 h-4" />
      {text}
    </motion.button>
  );

  // --- JSX RENDER ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600/20 p-6 font-sans">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Welcome Banner */}
        <motion.div
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8 mt-15 "
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome, {user ? user.username : 'Professor'}.
              </h1>
              <p className="text-white/70 text-lg">
                Here an overview of your classes and students.
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon={BookOpen}
            title="Total Courses Teaching"
            value={teacherData.totalCourses}
            delay={0.1}
          />
          <StatsCard
            icon={Users}
            title="Total Students"
            value={teacherData.totalStudents}
            delay={0.2}
          />
          <StatsCard
            icon={Calendar}
            title="Average Attendance"
            value={`${teacherData.avgAttendance}%`}
            delay={0.3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Course Cards */}
          <div className="lg:col-span-2">
            <motion.h2
              variants={itemVariants}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-white mb-6"
            >
              Your Courses
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teacherData.courses.map((course, index) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  delay={0.5 + index * 0.1}
                />
              ))}
            </div>
          </div>

          {/* Student List */}
          <div>
            <motion.h2
              variants={itemVariants}
              transition={{ delay: 0.7 }}
              className="text-2xl font-bold text-white mb-6"
            >
              Student List
            </motion.h2>
            <motion.div
              variants={itemVariants}
              transition={{ delay: 0.8 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <div className="space-y-3">
                {/* Table Header */}
                <div className="flex justify-between items-center px-3 text-white/60 text-sm font-bold">
                    <p className="w-1/4">Roll No.</p>
                    <p className="w-1/2">Name</p>
                    <p className="w-1/4 text-right">Attendance</p>
                </div>
                {/* Table Body */}
                {teacherData.students.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                  >
                    <p className="text-white/80 w-1/4 text-sm">{student.rollNo}</p>
                    <p className="text-white font-medium w-1/2">{student.name}</p>
                    <p className="text-white font-semibold w-1/4 text-right">{student.attendance}%</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          variants={itemVariants}
          transition={{ delay: 1.3 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <ActionButton icon={ClipboardCheck} text="Mark Attendance" delay={1.4} />
            <Link href="/manage-grades">
            <ActionButton icon={FilePlus} text="Add Grades" delay={1.5} />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;