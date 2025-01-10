import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UseOrderData = (id) => {
  const [order, setOrder] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deal_value: '',
    currency: '',
    file: '',
    provider_name: '',
    office_phone_number: '',
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8765/api/order/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            },
          }
        );
        setOrder(response.data);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          deal_value: response.data.deal_value,
          currency: response.data.currency,
          file: response.data.file,
          provider_name: response.data.provider_name,
          office_phone_number: response.data.office_phone_number,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching company data:', error);
        setErrorMessage('Помилка завантаження даних компанії.');
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { file, ...formDataWithoutFile } = formData;
    console.log('Sending form data:', formData);
    try {
      const response = await axios.put(
        `http://localhost:8765/api/order/${id}/`,
        formDataWithoutFile,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        }
      );
      setSuccessMessage('Дані компанії оновлено успішно');
      setErrorMessage('');
    } catch (err) {
      setErrorMessage('Помилка оновлення даних.');
      console.log(err.response);
      setSuccessMessage('');
    }
  };

  return {
    order,
    formData,
    setFormData,
    loading,
    successMessage,
    errorMessage,
    handleSubmit,
  };
};

export default UseOrderData;
