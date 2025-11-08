import axios from 'axios';
import { API_BASE_URL } from '@/constants/config';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_AUDIO_TYPES = ['audio/webm', 'audio/mp3', 'audio/wav', 'audio/ogg'];

class UploadService {
  private validateFileSize(file: File): void {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size should not exceed ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }
  }

  private validateFileType(file: File, type: 'image' | 'voice'): void {
    const allowedTypes = type === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_AUDIO_TYPES;
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
    }
  }

  async uploadFile(file: File, type: 'image' | 'voice', context: string = 'chat'): Promise<string> {
    try {
      this.validateFileSize(file);
      this.validateFileType(file, type);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('context', context);

      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          // You can use this to update a progress bar if needed
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });

      return response.data.file_url;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Upload failed');
      }
      throw error;
    }
  }
}

export const uploadService = new UploadService(); 