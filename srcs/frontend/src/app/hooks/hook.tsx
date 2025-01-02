// src/hooks/useApi.js
import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (endpoint) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}${endpoint}`, {
        withCredentials: true
      });
      setLoading(false);
      return data;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, []);

  return { fetchData, loading, error };
};