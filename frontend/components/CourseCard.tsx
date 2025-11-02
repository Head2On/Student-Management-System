"use client"
import React, { useState, useEffect } from 'react';
import { Plus, Grid, List, X } from 'lucide-react';
import { Course, NewCourseData, createCourse, Teacher, fetchTeachers } from '@/services/courseService';
import { useAuthContext } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck } from 'lucide-react';

interface CoursesPageProps {
  courses: Course[];
  onCourseCreated: () => void;
}

export default function CoursesPage({ courses, onCourseCreated }: CoursesPageProps) {
  const { user } = useAuthContext();
  
  const [showNewCourseModal, setShowNewCourseModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [activeCategory, setActiveCategory] = useState('All Category');
  
  // Form state
  const [isCreating, setIsCreating] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseImage, setNewCourseImage] = useState<File | null>(null);
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState<number>(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [newCourseStatus, setNewCourseStatus] = useState<string>('unverified');
  const [selectedProductType, setSelectedProductType] = useState('online');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const categories = ['All Category', 'UI/UX Design', 'Graphic Design', 'Animation', 'Web Development', 'Branding'];

  const productTypes = [
    { id: 'online', icon: '📚', title: 'Online Courses', description: 'Create a series of lessons with files, posts, and quizzes.', color: 'bg-purple-100' },
    { id: 'digital', icon: '📥', title: 'Digital Downloads', description: 'Offer a file or collection of files for download.', color: 'bg-blue-100' },
    { id: 'webinar', icon: '📹', title: 'Webinar', description: 'Get access to a Zoom or YouTube webinar.', color: 'bg-red-100' },
  ];

  useEffect(() => {
    // Only fetch teachers when the modal is opened
    if (showNewCourseModal) {
      const loadTeachers = async () => {
        try {
          const teacherData = await fetchTeachers();
          setTeachers(teacherData);
        } catch (error) {
          console.error("Failed to load teachers:", error);
          setFormError("Could not load the teacher list.");
        }
      };
      loadTeachers();
    }
  }, [showNewCourseModal]);

  const handleCreateCourse = async () => {
    if (!user) {
      setFormError("You must be logged in to create a course.");
      return;
    }
    
    if (!newCourseName || !newCourseCode || !selectedTeacherId) {
      setFormError("Course Name, Course Code are required.");
      return;
    }

    const courseData: NewCourseData = {
      name: newCourseName,
      code: newCourseCode,
      description: newCourseDescription,
      teacher: parseInt(selectedTeacherId),
      image:newCourseImage,
      price:newCoursePrice,
      status:newCourseStatus,
    };

    try {
      setFormError(null);
      setIsCreating(true);
      await createCourse(courseData);
      
      // Success!
      setShowNewCourseModal(false);
      closeAndResetModal();
      onCourseCreated();
      
      // Reset form
      setNewCourseName('');
      setNewCourseCode('');
      setNewCourseDescription('');

    } catch (error) {
      console.error(error);
      setFormError("Failed to create course. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const closeAndResetModal = () => {
    setShowNewCourseModal(false);
    setFormError(null);
    setNewCourseName('');
    setNewCourseCode('');
    setNewCourseImage(null);
    setNewCoursePrice(0);
    setNewCourseStatus('unverified');
    setNewCourseDescription('');
    setSelectedTeacherId('');
    setTeachers([]);
  }
// 5. New handler for file input
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewCourseImage(e.target.files[0]);
    } else {
      setNewCourseImage(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-domine">
      {/* Trial Banner */}
      <div className="bg-gray-100 border border-gray-300 rounded-lg px-6 py-4 mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-700">
          You have <span className="font-bold">30 days</span> left on your free trial of the Personal plan. 
          <a href="#" className="text-purple-600 font-semibold ml-2 hover:underline">Upgrade Now</a>
        </p>
        <button className="text-gray-500 hover:text-gray-700">
          <X size={18} />
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Courses</h1>
          <p className="text-gray-600">Create and manage courses in your school.</p>
        </div>
        <button
          onClick={() => setShowNewCourseModal(true)}
          className="flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
        >
          <Plus size={20} />
          <span className="font-medium">New Course</span>
        </button>
      </div>

      {/* Category Tabs & View Toggle */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-gray-800 text-white'
                    : 'bg-orange-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-3 gap-6 text-black">
        {courses.map((course) => (
          <Link
            href={`/checkout/${course.id}`} 
            key={course.id} 
            className="group" // for hover effect
          >

          <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {course.image ? (
              <Image src={course.image} alt={course.name} width={400} height={192}  className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 bg-purple-100 flex items-center justify-center text-6xl">
                📚
              </div>
            )}
            <div className="p-6">
              <div className="mb-2">
                <span className="text-xs font-bold text-gray-600 bg-cyan-200 px-3 py-2 rounded">
                  {course.code}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">{course.name}</h3>
              <p className="text-lg font-bold text-gray-600 mb-4 h-16 overflow-hidden">
                {course.description || 'No description provided.'}
              </p>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Teacher</p>
                  <p className="font-medium text-gray-800">{course.teacher_name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs px-3">Sales</p>
                  <p className="font-medium text-gray-800">{course.price}</p>
                </div>
                 <div>
                  <p className="text-gray-500 text-xs px-3">Status</p>
                  <span className={`inline-flex items-center gap-1 px-3 py-2 rounded-full  text-bold font-medium ${
                  course.status === 'verified' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {course.status === 'verified' && <BadgeCheck size={15} />}
                  {course.status}
                </span>
                </div>
              </div>
            </div>
          </div>
          </Link>
        ))}
      </div>

      {/* New Course Modal */}
      {showNewCourseModal && (
        <div className="fixed inset-0  flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col text-black">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
              <h2 className="text-2xl font-bold text-gray-800">New Course</h2>
              <button
                onClick={closeAndResetModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-6 overflow-y-auto flex-1">
              {formError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-8">
                {/* Left Side - Course Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Course Information</h3>
                  
                  {/* Course Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Name
                    </label>
                    <input
                      type="text"
                      value={newCourseName}
                      onChange={(e) => setNewCourseName(e.target.value)}
                      placeholder="e.g., Introduction to Python"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Course Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Code
                    </label>
                    <input
                      type="text"
                      value={newCourseCode}
                      onChange={(e) => setNewCourseCode(e.target.value)}
                      placeholder="e.g., CS101"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* --- 9. ADD TEACHER DROPDOWN --- */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign Teacher
                    </label>
                    <select
                      value={selectedTeacherId}
                      onChange={(e) => setSelectedTeacherId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    >
                      <option value="" disabled>Select a teacher...</option>
                      {teachers.length > 0 ? (
                        teachers.map((teacher) => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.username} (ID: {teacher.id})
                          </option>
                        ))
                      ) : (
                        <option disabled>Loading teachers...</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Image
                    </label>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/png, image/jpeg, image/gif"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500
                                 file:mr-4 file:py-2 file:px-4
                                 file:rounded-full file:border-0
                                 file:text-sm file:font-semibold
                                 file:bg-purple-50 file:text-purple-700
                                 hover:file:bg-purple-100"
                    />
                    {/* Show a preview of the selected file name */}
                    {newCourseImage && (
                      <p className="text-sm text-gray-500 mt-2">
                        Selected: {newCourseImage.name}
                      </p>
                    )}
                  </div>
                  

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newCourseDescription}
                      onChange={(e) => setNewCourseDescription(e.target.value)}
                      placeholder="A brief description of the course..."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>
                </div>
                
                 {/*Add Status Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={newCourseStatus}
                      onChange={(e) => setNewCourseStatus(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    >
                      <option value="unverified">Unverified</option>
                      <option value="verified">Verified</option>
                    </select>
                  </div>

                {/* Add Price Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      value={newCoursePrice}
                      onChange={(e) => setNewCoursePrice(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      min="0.00"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>


                {/* Right Side - Product Type */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Product Type (UI Only)</h3>
                  <div className="space-y-3">
                    {productTypes.map((type) => (
                      <label
                        key={type.id}
                        className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="radio"
                          name="productType"
                          value={type.id}
                          checked={selectedProductType === type.id}
                          onChange={(e) => setSelectedProductType(e.target.value)}
                          className="mt-1 w-5 h-5 text-purple-600 focus:ring-2 focus:ring-purple-500"
                        />
                        <div className={`${type.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0`}>
                          {type.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{type.title}</p>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer - Fixed at bottom */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 shrink-0 bg-white">
              <button
                onClick={closeAndResetModal}
                disabled={isCreating}
                className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Discard
              </button>
              <button
                onClick={handleCreateCourse}
                disabled={isCreating}
                className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  'Create Course'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}