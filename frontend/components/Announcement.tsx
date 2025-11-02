"use client";
import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';

interface Notification {
  id: number;
  author: string;
  avatar: string;
  time: string;
  title: string;
  preview: string;
  fullContent: string;
  isRead: boolean;
  badge: string;
  subtitle?: string; // Make subtitle optional since it doesn't exist in your data
}

interface NotificationsPageProps {
  initialNotifications?: Notification[];
}

export default function NotificationsPage({}: NotificationsPageProps) {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const notifications: Notification[] = [
    {
      id: 1,
      author: 'Pixelwave',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      time: '1h ago',
      title: 'Commented on Classic Car in Studio',
      preview: 'These draggabale sliders look really cool. Maybe these could be displayed when you hold shift, t...',
      fullContent: 'These draggabale sliders look really cool. Maybe these could be displayed when you hold shift, this would make the interface even more intuitive and user-friendly. What do you think about this approach?',
      isRead: false,
      badge: '💬'
    },
  ]

  const filteredNotifications = activeTab === 'All' 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  if (selectedNotification) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setSelectedNotification(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Notifications</span>
          </button>

          {/* Notification Detail Card */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="relative">
                <img
                  src={selectedNotification.avatar}
                  alt={selectedNotification.author}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <span className="absolute -bottom-1 -right-1 text-2xl">{selectedNotification.badge}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedNotification.author}</h2>
                    <p className="text-gray-600 mt-1">{selectedNotification.title}</p>
                    {selectedNotification.subtitle && (
                      <p className="text-sm text-gray-500 mt-1">{selectedNotification.subtitle}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{selectedNotification.time}</span>
                </div>
              </div>
            </div>

            {/* Full Content */}
            <div className="mb-8">
              <p className="text-gray-700 text-lg leading-relaxed">{selectedNotification.fullContent}</p>
            </div>

            {/* Mark as Read Button */}
            <button
              onClick={() => {
                setSelectedNotification(null);
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Mark as Read
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('All')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'All'
                  ? 'text-gray-800 border-b-2 border-gray-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('Unread')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'Unread'
                  ? 'text-gray-800 border-b-2 border-gray-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Unread
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => setSelectedNotification(notification)}
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={notification.avatar}
                    alt={notification.author}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <span className="absolute -bottom-1 -right-1 text-xl">{notification.badge}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="font-semibold text-gray-800">{notification.author}</span>
                      <span className="text-gray-500 ml-2">{notification.time}</span>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                  <p className="font-medium text-gray-800 mb-1">{notification.title}</p>
                  {notification.subtitle && (
                    <p className="text-sm text-gray-600 mb-1">{notification.subtitle}</p>
                  )}
                  <p className="text-gray-600 text-sm line-clamp-2">{notification.preview}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}