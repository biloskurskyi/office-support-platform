import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';

interface Manager {
  id: number;
  surname: string;
  name: string;
  email: string;
  user_type: number;
  info: string;
  company: number;
  is_active: boolean;
}

const useFetchData = (url: string | null) => {
  const [managers, setData] = useState<Manager[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const userType = localStorage.getItem('user_type');

        if (!token) {
          setError('Необхідно авторизуватися.');
          return;
        }

        if (userType !== '1') {
          setError('У вас немає прав на перегляд.');
          return;
        }

        const response: AxiosResponse<Manager[]> = await axios.get(url!, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setData(response.data);
      } catch (err) {
        setError('Не вдалося завантажити дані. Спробуйте пізніше.');
        console.error('Помилка завантаження даних:', err);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url]);

  return { managers, loading, error };
};

export default useFetchData;
