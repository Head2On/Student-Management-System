'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { User, BookOpen, Hash, ArrowRight, GraduationCap } from 'lucide-react';
import Image from 'next/image';

// 1. Define the shape of your student data
interface Student {
  id: number;
  name: string;
  rollNumber: string;
  course: string;
  avatarUrl: string | null; // Can be a string or null
}

// 2. Define the props for your StudentCard component
interface StudentCardProps {
  name?: string;
  rollNumber?: string;
  course?: string;
  avatarUrl?: string | null;
  onViewProfile?: () => void;
}

// Reusable StudentCard Component
const StudentCard = ({ 
  name = "John Doe", 
  rollNumber = "2024001", 
  course = "Computer Science", 
  avatarUrl = null,
  onViewProfile = () => {}
}: StudentCardProps) => {
  return (
    <motion.div
      className="relative backdrop-blur-xl bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/30 rounded-2xl p-6 shadow-xl overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated linear background on hover */}
      <motion.div
        className="absolute inset-0 bg-linear-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
      />
      
      {/* Animated shadow */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-2xl"
        initial={{ boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.3)" }}
        whileHover={{ 
          boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.4)",
          transition: { duration: 0.3 }
        }}
      />

      {/* Top Section: Avatar and Basic Info */}
      <div className="relative z-10 flex items-start space-x-4 mb-4">
        {/* Avatar */}
        <motion.div
          className="relative shrink-0"
          whileHover={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.5 }}
        >
          {avatarUrl ? (
            <Image 
              src={avatarUrl}
              width={250}
              height={250} 
              alt={name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-white/30 shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-white/30 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
          )}
          <motion.div
            className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white/30"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
          />
        </motion.div>

        {/* Name and Roll Number */}
        <div className="flex-1 min-w-0">
          <motion.h3 
            className="text-lg font-semibold text-white truncate"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {name}
          </motion.h3>
          <motion.div 
            className="flex items-center space-x-2 mt-1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Hash className="w-3 h-3 text-white/60" />
            <span className="text-sm text-white/70">Roll: {rollNumber}</span>
          </motion.div>
        </div>
      </div>

      {/* Course Information */}
      <motion.div 
        className="relative z-10 mb-5"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center space-x-2 px-3 py-2 bg-white/5 rounded-lg backdrop-blur-sm">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-white/80 font-medium">{course}</span>
        </div>
      </motion.div>

      {/* View Profile Button */}
      <motion.button
        onClick={onViewProfile}
        className="relative z-10 w-full group/btn overflow-hidden rounded-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative px-4 py-2.5 bg-linear-to-r from-blue-500 to-purple-600 text-white font-medium text-sm flex items-center justify-center space-x-2 rounded-lg shadow-lg">
          {/* Button shine effect */}
          <motion.div
            className="absolute inset-0 -top-2 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12"
            initial={{ x: "-200%" }}
            whileHover={{ x: "200%" }}
            transition={{ duration: 0.6 }}
          />
          <span className="relative">View Profile</span>
          <motion.div
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>
      </motion.button>

      {/* Decorative corner linear */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl" />
    </motion.div>
  );
};

// Demo Component showing the StudentCard in different layouts
const StudentCardDemo = () => {
  const students = [
    {
      id: 1,
      name: "Emma Watson",
      rollNumber: "2024001",
      course: "Computer Science",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
    },
    {
      id: 2,
      name: "James Rodriguez",
      rollNumber: "2024002",
      course: "Data Science",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
    },
    {
      id: 3,
      name: "Sophia Chen",
      rollNumber: "2024003",
      course: "Artificial Intelligence",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop"
    },
    {
      id: 4,
      name: "Michael Brown",
      rollNumber: "2024004",
      course: "Web Development",
      avatarUrl: null // This will show the default avatar
    },
    {
      id: 5,
      name: "Isabella Martinez",
      rollNumber: "2024005",
      course: "Machine Learning",
      avatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop"
    },
    {
      id: 6,
      name: "David Kim",
      rollNumber: "2024006",
      course: "Cybersecurity",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"
    }
  ];

  const handleViewProfile = (student:Student) => {
    console.log(`Viewing profile for ${student.name}`);
    // In a real app, this would navigate to the student's profile page
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-400 via-white to-indigo-400 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="inline-flex items-center space-x-2 mt-15 mb-2">
          <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Student Directory</h1>
        </div>
      </motion.div>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {students.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StudentCard
              name={student.name}
              rollNumber={student.rollNumber}
              course={student.course}
              avatarUrl={student.avatarUrl}
              onViewProfile={() => handleViewProfile(student)}
            />
          </motion.div>
        ))}
      </div>

      {/* Feature Highlights */}
      <motion.div 
        className="mt-12 text-center text-white/50 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p>✨ Hover over cards to see animations</p>
        <p className="mt-2">📱 Responsive design - try resizing your window</p>
      </motion.div>
    </div>
  );
};

export default StudentCardDemo;