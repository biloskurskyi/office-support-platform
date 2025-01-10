import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const UseUtilityData = (id) => {
  const [utility, setUtility] = useState(null);
  const [formData, setFormData] = useState({
    utilities_type_display: '',
    date: '',
    counter: '',
    price: '',
    office_display: '',
    office_id: '',
    utility_type_id: '',
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8765/api/utility/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            },
          }
        );
        setUtility(response.data);
        setFormData({
          utilities_type_display: response.data.utilities_type_display,
          date: response.data.date,
          counter: response.data.counter,
          price: response.data.price,
          office_display: response.data.office_display,
          office_id: response.data.office_id,
          utility_type_id: response.data.utility_type_id,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching company data:', error);
        setErrorMessage('Помилка завантаження даних комунальних послуг.');
        setLoading(false);
        navigate('/navigate');
      }
    };

    fetchCompanyData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedDate = formData.date
      ? dayjs(formData.date).format('YYYY-MM-DD')
      : '';

    console.log(formattedDate);

    try {
      const response = await axios.put(
        `http://localhost:8765/api/utility/${id}/`,
        { ...formData, date: formattedDate },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        }
      );
      setSuccessMessage('Дані про комунальну послугу оновлено успішно');
      setErrorMessage('');
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;

        if (errorData.counter && Array.isArray(errorData.counter)) {
          setErrorMessage(errorData.counter[0]);
        } else if (errorData.error && Array.isArray(errorData.error)) {
          setErrorMessage(errorData.error[0]);
        } else if (errorData.detail) {
          setErrorMessage(errorData.detail);
        } else {
          console.log(formData);
          setErrorMessage('Помилка при обробці данних');
        }
      } else {
        setErrorMessage("Не вдалося з'єднатися з сервером.");
      }
      setSuccessMessage('');
    }
  };

  return {
    utility,
    formData,
    setFormData,
    loading,
    successMessage,
    errorMessage,
    handleSubmit,
  };
};

export default UseUtilityData;
