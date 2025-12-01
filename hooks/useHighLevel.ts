import { useState } from 'react';

const HIGHLEVEL_API_BASE = 'https://services.leadconnectorhq.com';
const API_VERSION = '2021-07-28';

interface ContactData {
  firstName: string;
  lastName?: string;
  name?: string;
  email: string;
  phone?: string;
  customFields?: Array<{ id: string; field_value: any } | { key: string; field_value: any }>; 
  tags?: string[];
  source?: string;
  locationId?: string;
}

export const useHighLevel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = import.meta.env.VITE_HIGHLEVEL_TOKEN;
  const locationId = import.meta.env.VITE_HIGHLEVEL_LOCATION_ID;

  if (!token || !locationId) {
    console.warn("HighLevel credentials missing from .env.local");
  }

  const submitForm = async (data: Omit<ContactData, 'locationId'>) => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...data,
        locationId,
      };

      const response = await fetch(`${HIGHLEVEL_API_BASE}/contacts/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Version': API_VERSION,
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit form');
      }

      return await response.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${HIGHLEVEL_API_BASE}/medias/upload-file`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Version': API_VERSION,
          'Accept': 'application/json'
        },
        body: formData
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.message || 'Failed to upload file');
      }

      return await response.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitForm,
    uploadFile,
    loading,
    error
  };
};
