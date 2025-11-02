'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';
import { 
  BookOpen, 
  User,
  LogOut,
  FileText, 
  ClipboardCheck, 
  MessageSquare, 
  HelpCircle,
  ChevronLeft,
  House,
  ReceiptIndianRupee,
  GraduationCap,
  Menu
} from 'lucide-react';


export default function Navbar() {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuthContext();
  const userRole = user?.role;

  const menuItems = [
    { icon: BookOpen, label: 'Courses', href: '/courses', roles: ['admin', 'teacher', 'student'] },
    { icon: FileText, label: 'Attendance', href: '/attendance', roles: ['teacher', 'student'] },
    { icon: ClipboardCheck, label: 'Results', href: '/results', roles: ['admin', 'teacher', 'student'] },
    { icon: MessageSquare, label: 'Notices', href: '/announcement', roles: ['admin', 'teacher', 'student'] },
    { icon: GraduationCap, label: 'Students', href: '/manage-students', roles: ['admin'] }, // <-- THIS IS THE KEY CHANGE
    { icon: ReceiptIndianRupee, label: 'Fee Details', href: '/fees', roles: ['admin', 'student'] },
    { icon: House, label: 'Mess', href: '/manage-room', roles: ['admin','student'] },
  ];

  const bottomItems = [
    // { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: HelpCircle, label: 'Help', href: '/help' },
    { icon: User, label: 'Profile', href: '/profile' ,roles:['admin','student','teacher']},
    { icon: LogOut, label: 'Logout', href: '/', action: logout },
  ];

  const sidebarVariants = {
    open: { width: 256, opacity: 1 },
    collapsed: { width: 80, opacity: 1 }
  };

  const contentVariants = {
    open: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 }
  };

  const initials = user?.username ? user.username.substring(0, 2).toUpperCase() : '??';

  return (

    <div className='font-bold font-domine'>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsCollapsed(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial="open"
        animate={isCollapsed ? "collapsed" : "open"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed lg:static h-screen bg-white border-r border-gray-200 flex flex-col z-50 ${
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        }`}
      >
        {/* Logo and Toggle */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                key="logo"
                initial="open"
                animate="open"
                exit="collapsed"
                variants={contentVariants}
                className="flex items-center gap-2 min-w-0"
              >
                <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="text-xl font-bold text-gray-800 truncate">Arced</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-cyan-100 transition-colors shrink-0"
          >
            {isCollapsed ? (
              <Menu className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            )}
          </motion.button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems
            .filter(item => {
              const itemRoles = item.roles;
              if (!itemRoles) {
                return true;
              }
              if (!userRole) {
                return false;
              }
              return itemRoles.includes(userRole);
            })
          .map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;
            
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setActiveItem(item.label)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:bg-cyan-100'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon size={20} className="shrink-0" />
                
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial="open"
                      animate="open"
                      exit="collapsed"
                      variants={contentVariants}
                      className="flex items-center justify-between flex-1 min-w-0"
                    >
                      <span className="font-medium truncate">{item.label}</span>
                      
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;
            
            // For logout, use a button with action, for others use Link
            if (item.action) {
              return (
                <motion.button
                  key={item.label}
                  onClick={() => {
                    setActiveItem(item.label);
                    item.action();
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:bg-cyan-100'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <Icon size={20} className="shrink-0" />
                  
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial="open"
                        animate="open"
                        exit="collapsed"
                        variants={contentVariants}
                        className="font-medium truncate hover:bg-cyan-100"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            }
            
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setActiveItem(item.label)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:bg-cyan-100'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon size={20} className="shrink-0" />
                
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial="open"
                      animate="open"
                      exit="collapsed"
                      variants={contentVariants}
                      className="font-medium truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </div>

        {/* User Profile - Only show when expanded */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial="open"
              animate="open"
              exit="collapsed"
              variants={contentVariants}
              className="p-4 border-t border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{initials}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {user?.username || 'User'}
                  </p>
                  {/* <p className="text-xs text-gray-500 truncate capitalize">
                    {user?.role || 'Admin'}
                  </p> */}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsCollapsed(false)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        <Menu className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  );
}