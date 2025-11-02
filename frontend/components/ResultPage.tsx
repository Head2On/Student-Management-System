"use client";
import { useState } from 'react';
import { ArrowLeft} from 'lucide-react';

interface Semester {
  id: number;
  title: string;
  year: string;
}

export default function ResultPage() {
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
  const [rollNumber, setRollNumber] = useState('');
  const [year, setYear] = useState('');

  const semesters: Semester[] = [
    { id: 1, title: '1st Semester Result', year: '2024' },
    { id: 2, title: '2nd Semester Result', year: '2024' },
    { id: 3, title: '3rd Semester Result', year: '2023' },
    { id: 4, title: '4th Semester Result', year: '2023' },
    { id: 5, title: '5th Semester Result', year: '2022' },
    { id: 6, title: '6th Semester Result', year: '2022' }
  ];

  const handleSemesterClick = (semester: Semester) => {
    setSelectedSemester(semester);
    setRollNumber('');
    setYear('');
  };

  const handleViewResult = () => {
    if (!selectedSemester) return;
    
    console.log('Viewing result for:', { 
      semester: selectedSemester.title, 
      rollNumber, 
      year 
    });
    // Here you would fetch and display the actual result
  };

  if (selectedSemester) {
    return (
      <div className="min-h-screen bg-yellow-50 p-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setSelectedSemester(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Results</span>
          </button>

          {/* Result Form Card */}
          <div className="bg-white rounded-2xl shadow-sm p-8 text-black">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedSemester.title}
            </h2>
            <p className="text-gray-600 mb-8">
              Enter your details to view your result
            </p>

            <div className="space-y-6">
              {/* Roll Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Roll Number
                </label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="Enter your roll number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Enter year (e.g., 2024)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* View Result Button */}
              <button
                onClick={handleViewResult}
                disabled={!rollNumber || !year}
                className="w-full bg-blue-600 text-black py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:cursor-not-allowed"
              >
                View Result
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-orange-500 mb-2">Results</h1>
          <p className="text-gray-600">Check your semester results</p>
        </div>

        {/* Semester Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {semesters.map((semester) => (
            <button
              key={semester.id}
              onClick={() => handleSemesterClick(semester)}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-lg transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {semester.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Academic Year: {semester.year}</p>
                </div>
                <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Important Note</h4>
              <p className="text-sm text-blue-700">
                Please have your roll number and academic year ready before checking your results. 
                If you face any issues accessing your results, please contact the administration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}