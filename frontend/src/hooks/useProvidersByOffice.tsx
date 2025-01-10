import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

interface Provider {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  email: string;
  company: string;
  bank_details: string;
}

const UseProvidersByOffice = (officeId: string) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');

        if (!token) {
          setError('Необхідно авторизуватися.');
          return;
        }

        const response: AxiosResponse<Provider[]> = await axios.get(
          `http://localhost:8765/api/get-all-providers-by-office/${officeId}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProviders(response.data);
      } catch (error) {
        setError('Не вдалося завантажити провайдерів. Спробуйте пізніше.');
        console.error('Помилка завантаження даних:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [officeId]);

  return { providers, loading, error };
};

export default UseProvidersByOffice;
