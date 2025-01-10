import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box } from '@mui/material';
import FormPaper from '../components/RegisterForm/UI/FormPaper.tsx';
import useAccessToProvider from '../hooks/useAccessToProvider.tsx';
import ProviderForm from '../components/ProviderComponents/ProviderForm';

const ProviderCreatePage = () => {
  const { setText } = useOutletContext<{
    setText: (text: React.ReactNode) => void;
  }>();
  const { id } = useParams<{ id: string }>();
  useAccessToProvider(id);

  useEffect(() => {
    setText(<h2>Створити постачальника компанії</h2>);
  }, [setText]);

  const [formData, setFormData] = useState({
    address: '',
    name: '',
    email: '',
    phone_number: '',
    bank_details: '',
    company: '',
    company_id: id || '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.address || !formData.name || !formData.address) {
      setErrorMessage('Будь ласка, заповніть усі поля');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8765/api/provider/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        }
      );
      navigate(`/provider-list/${id}`);
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          error.response.data.detail || 'Некоректно введені дані!'
        );
      } else {
        setErrorMessage("Не вдалося з'єднатися з сервером");
      }
    }
  };

  return (
    <>
      <div style={{ height: '500px' }} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '10px',
        }}
      >
        <FormPaper title="Створення постачальника">
          <ProviderForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            errorMessage={errorMessage}
          />
        </FormPaper>
      </Box>
      <div style={{ height: '50px' }} />
    </>
  );
};

export default ProviderCreatePage;
