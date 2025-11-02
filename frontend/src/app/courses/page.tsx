'use client'

import CoursesPage from "../../../components/CourseCard";
import { fetchCourses } from '@/services/courseService';
import { useEffect, useState } from "react";
import { Course } from '@/services/courseService'; // Import the correct interface


export default function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        const coursesData = await fetchCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    useEffect(() => {
    loadCourses();
  }, []);

  return (
    <section>
        {isLoading ? (
          <p className="p-8">Loading courses...</p>
        ) : (
          <CoursesPage 
            courses={courses} 
            onCourseCreated={loadCourses} // <-- PASS THE FUNCTION HERE
          />
        )}
    </section>
  );
}