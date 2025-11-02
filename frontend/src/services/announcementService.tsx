// src/services/announcementService.ts
import apiClient from '@/lib/api';

export interface Announcement {
  id: string | number; // or number
  title: string;
  content: string;
  created_at: string;
}

// --- Get ALL Announcements ---
export const getAllAnnouncements = async (): Promise<Announcement[]> => {
  try {
    // GET /api/announcements/
    const response = await apiClient.get('/api/announcements/');
    return response.data;
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
};

// --- Create a NEW Announcement ---
export const createAnnouncement = async (data: Omit<Announcement, 'id' | 'created_at'>): Promise<Announcement> => {
  try {
    // POST /api/announcements/
    const response = await apiClient.post('/api/announcements/', data);
    return response.data;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};