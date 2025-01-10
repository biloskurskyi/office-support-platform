import { useState, useEffect } from 'react';
import axios from 'axios';

const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const userType = localStorage.getItem('user_type');

    if (!token) {
      console.error('Токен не знайдений');
      return;
    }
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8765/api/get-user/',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { userData, loading, error };
};

export default useUserData;
