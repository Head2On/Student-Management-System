'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getCourseById, Course } from '@/services/courseService';
import Image from 'next/image'; // Check this import path
import api from '@/lib/api';


export default function CheckoutPage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchCourse = async () => {
      const courseId = params.courseId as string;
      if (!courseId) return;

      try {
        setIsLoading(true);
        const courseData = await getCourseById(parseInt(courseId));
        setCourse(courseData);
      } catch (error) {
        console.error(error);
        setError('Failed to load course details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [params.courseId]);

  const handleCheckout = async () => {
    if (!course) return;

    try {
      // 4. Call your backend (this is unchanged)
      const response = await api.post('/api/payments/create-checkout-session/', {
        courseId: course.id,
      });

      // 5. The response now contains the URL from your (updated) backend
      const session = response.data;
      
      if (session.url) {
        // 6. Just redirect the browser directly to the Stripe page
        window.location.href = session.url;
      } else {
        setError('Failed to get checkout URL from server.');
      }

    } catch (err) {
      console.error("Checkout error:", err);
      setError('Failed to create checkout session.');
    }
  };
  
  // ... (Loading, Error, and Not Found states are the same) ...
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 overflow-auto p-8 text-center">
          <p>Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 overflow-auto p-8 text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (!course) {
     return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 overflow-auto p-8 text-center">
          <p>Course not found.</p>
        </div>
      </div>
    );
  }
  

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto p-8 flex justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
          
         
          <Image
            src={course.image} 
            alt={course.name}
            width={400}
            height={256} 
            className="w-full h-64 object-cover rounded-lg mb-4" 
          />
          {/* --- END OF FIX --- */}

          <h2 className="text-2xl font-semibold mb-2">{course.name}</h2>
          <p className="text-gray-600 mb-4">{course.description || "No description available."}</p>
          <div className="text-3xl font-bold text-gray-800 mb-6">
            ${course.price}
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

