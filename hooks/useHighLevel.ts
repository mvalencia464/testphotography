import { useState, useCallback } from 'react';

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

interface GHLFile {
  _id: string;
  url: string;
  name: string;
  type: string;
  // Add other fields if needed
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

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        altType: 'location',
        altId: locationId,
        type: 'file',
        limit: '100'
      });

      const response = await fetch(`${HIGHLEVEL_API_BASE}/medias/files?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Version': API_VERSION,
          'Accept': 'application/json'
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch files');
      }

      const data = await response.json();
      return data.files as GHLFile[];
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, locationId]);

  const deleteFile = async (fileId: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        altType: 'location',
        altId: locationId
      });

      const response = await fetch(`${HIGHLEVEL_API_BASE}/medias/${fileId}?${params.toString()}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Version': API_VERSION,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete file');
      }

      return true;
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
    fetchFiles,
    deleteFile,
    loading,
    error
  };
};

