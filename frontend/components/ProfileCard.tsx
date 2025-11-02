"use client";
import { useState} from 'react';
import { Phone, Mail, Calendar, UserX, TrendingUp, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { useAuthContext} from '@/context/AuthContext';
import StudentAttendanceView from './StudentAttendance';

export default function StudentProfile() {
  const [selectedPeriod, setSelectedPeriod] = useState('A4');
  const { user, isLoading } = useAuthContext();

  const [attendanceStats, setAttendanceStats] = useState({
    totalPresent: 0,
    totalAbsent: 0,
  });

  const studentData = {
    name: "Mithun Ray",
    id: "UNI - 2456826",
    phone: "+88 01632534125",
    email: "mithunray@gmail.com",
    address: "245 Deo Street",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
  };

  const attendance = {
    total: 25,
    lastAttendance: 10,
    totalAbsent: 2
  };

  const grades = [
    { subject: "Mathematics", lastGrade: "A", avgGrade: "B+", improvement: "Improved", color: "text-cyan-500" },
    { subject: "English", lastGrade: "B+", avgGrade: "B", improvement: "Stable", color: "text-red-500" },
    { subject: "Science", lastGrade: "C", avgGrade: "A", improvement: "Improved", color: "text-cyan-500" },
    { subject: "Sports", lastGrade: "A", avgGrade: "A", improvement: "Improved", color: "text-cyan-500" }
  ];

  const assignments = [
    { subject: "Mathematics", task: "Geometry Builders", dueDate: "Oct 31", status: "Completed", statusColor: "text-cyan-500" },
    { subject: "English", task: "Character Profile", dueDate: "Nov 05", status: "Pending", statusColor: "text-red-500" }
  ];

  const academicPerformance = {
    mathematics: 160,
    english: 200,
    science: 80,
    ict: 70,
    sports: 50
  };

  const recentNotices = [
    {
      author: "Barney Rojas",
      role: "English Teacher",
      title: "Book Fair",
      content: "Your education path is an adventure filled with challenges, opportunities, and endless possibilities. Embrace each moment, stay focused.",
      date: "23 sep 2025",
      likes: 10,
      hearts: 9,
      comments: 24,
      avatars: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop", 
                "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop"]
    }
  ];

  if (isLoading) {
    return <div className="p-6">Loading profile...</div>;
  }
  if (!user) {
    return <div className="p-6">Please log in to see your profile.</div>;
  }
  if (user.role !== 'student') {
    return (
        <div className="p-6">
            <h1 className="text-xl font-bold">This is a student profile page.</h1>
            <p>Please log in as a student to view this content.</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-6">
              <Image 
                src={studentData.avatar} 
                alt={studentData.name}
                width={420}
                height={120}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">{user.username}</h1>
                <div className="flex gap-8 text-sm text-gray-600">
                  <div>
                    <p className="text-xs text-gray-400">ID</p>
                    <p className="font-medium">{user.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Number</p>
                    <p className="font-medium">{studentData.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Address</p>
                    <p className="font-medium">{studentData.address}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Phone size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Mail size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Attendance Stats */}
          <div className="flex gap-4 mt-6 rounded-xl">
            <div className="flex items-center gap-3 bg-cyan-50 rounded-xl px-4 py-3">
              <Calendar className="text-cyan-500" size={20} />
              <div>
                <p className="text-2xl font-bold text-gray-800">{attendance.total} Days</p>
                <p className="text-xs text-gray-600">Total Attendance</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <TrendingUp className="text-gray-600" size={20} />
              <div>
                <p className="text-2xl font-bold text-gray-800">{attendance.lastAttendance} Days</p>
                <p className="text-xs text-gray-600">Last Attendance</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-red-50 rounded-xl px-4 py-3">
              <UserX className="text-red-500" size={20} />
              <div>
                <p className="text-2xl font-bold text-gray-800">{attendance.totalAbsent} Days</p>
                <p className="text-xs text-gray-600">Total Absent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Performance */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Academic Performance</h2>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="A4">A4</option>
              <option value="A3">A3</option>
              <option value="A2">A2</option>
            </select>
          </div>

          <div className="flex gap-8 items-end mb-4 rounded-xl">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Mathematics</p>
              <p className="text-lg font-bold mb-1">{academicPerformance.mathematics} Grade</p>
              <div className="w-24 bg-linear-to-t from-cyan-400 to-cyan-300 rounded-xl " style={{height: '160px'}}></div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">English</p>
              <p className="text-lg font-bold mb-1">{academicPerformance.english} Grade</p>
              <div className="w-24 bg-linear-to-t from-cyan-400 to-cyan-300 rounded-t-lg relative" style={{height: '200px'}}>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Science</p>
              <p className="text-lg font-bold mb-1">{academicPerformance.science} Grade</p>
              <div className="w-24 bg-linear-to-t from-cyan-200 to-cyan-100 rounded-t-lg" style={{height: '80px'}}></div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">ICT</p>
              <p className="text-lg font-bold mb-1">{academicPerformance.ict} Grade</p>
              <div className="w-24 bg-linear-to-t from-cyan-200 to-cyan-100 rounded-t-lg" style={{height: '70px'}}></div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Sports</p>
              <p className="text-lg font-bold mb-1">{academicPerformance.sports} Grade</p>
              <div className="w-24 bg-linear-to-t from-cyan-200 to-cyan-100 rounded-t-lg" style={{height: '50px'}}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Grades Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Grades & Assignments Section</h2>
            
            <div className="mb-6">
              <div className="flex text-xs text-gray-500 mb-3 px-3">
                <span className="flex-1">Subject</span>
                <span className="w-20 text-center">Last Grade</span>
                <span className="w-20 text-center">Avg Grade</span>
                <span className="w-24 text-center">Improvement</span>
                <span className="w-8"></span>
              </div>
              {grades.map((grade, index) => (
                <div key={index} className="flex items-center py-3 px-3 hover:bg-gray-50 rounded-lg">
                  <span className="flex-1 font-medium text-gray-800">{grade.subject}</span>
                  <span className="w-20 text-center font-bold text-gray-800">{grade.lastGrade}</span>
                  <span className="w-20 text-center font-bold text-gray-800">{grade.avgGrade}</span>
                  <span className={`w-24 text-center text-sm font-medium ${grade.color}`}>{grade.improvement}</span>
                  <button className="w-8 hover:bg-gray-100 rounded p-1">
                    <MoreVertical size={16} className="text-gray-400" />
                  </button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex text-xs text-gray-500 mb-3 px-3">
                <span className="flex-1">Subject</span>
                <span className="w-32">Task</span>
                <span className="w-24 text-center">Due Date</span>
                <span className="w-24 text-center">Status</span>
                <span className="w-8"></span>
              </div>
              {assignments.map((assignment, index) => (
                <div key={index} className="flex items-center py-3 px-3 hover:bg-gray-50 rounded-lg">
                  <span className="flex-1 font-medium text-gray-800">{assignment.subject}</span>
                  <span className="w-32 text-sm text-gray-600">{assignment.task}</span>
                  <span className="w-24 text-center text-sm text-gray-600">{assignment.dueDate}</span>
                  <span className={`w-24 text-center text-sm font-medium ${assignment.statusColor}`}>{assignment.status}</span>
                  <button className="w-8 hover:bg-gray-100 rounded p-1">
                    <MoreVertical size={16} className="text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Summary & Recent Notice */}
          <div>
              <StudentAttendanceView onDataLoaded={setAttendanceStats}/>
          </div>

            {/* Recent Notice */}
            
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Notice</h3>
              
              {recentNotices.map((notice, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <Image 
                        src={notice.avatars[0]} 
                        alt={notice.author}
                        width={420}
                        height={120}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">{notice.author}</h4>
                        <p className="text-xs text-gray-500">{notice.role}</p>
                      </div>
                    </div>
                    <button className="text-sm text-gray-600 hover:text-gray-800">+ Comment</button>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-blue-600">{notice.title}</h5>
                      <span className="text-xs text-gray-500">{notice.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">{notice.content}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1 text-sm">
                        <span className="text-yellow-500">👍</span> {notice.likes}
                      </span>
                      <span className="flex items-center gap-1 text-sm">
                        <span className="text-red-500">❤️</span> {notice.hearts}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{notice.comments} comments</span>
                      <div className="flex -space-x-2">
                        {notice.avatars.map((avatar, i) => (
                          <Image 
                            key={i}
                            src={avatar} 
                            width={420}
                            height={120}
                            alt=""
                            className="w-6 h-6 rounded-full border-2 border-white object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}