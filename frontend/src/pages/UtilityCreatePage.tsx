import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import axios from 'axios';
import { Alert, Box, Snackbar } from '@mui/material';
import FormPaper from '../components/RegisterForm/UI/FormPaper.tsx';
import UtilityForm from '../components/UtilitiesComponents/UtilityForm.tsx';
import dayjs from 'dayjs';

const UtilityCreatePage = () => {
  const { setText } = useOutletContext<{
    setText: (text: React.ReactNode) => void;
  }>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    setText(<h2>Створити запис про комунальну послугу</h2>);
  }, [setText]);

  const [formData, setFormData] = useState({
    utilities_type: '',
    date: '',
    counter: '',
    price: '',
    office: id || '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Новий стан для повідомлення про успіх
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: any }>
  ) => {
    const { name, value } = e.target;
    if (name === 'date' && value) {
      // Переведення Dayjs в формат YYYY-MM-DD
      setFormData({
        ...formData,
        [name]: dayjs(value).format('YYYY-MM-DD'),
      });
    } else if (name === 'utilities_type') {
      // Якщо тип послуги WASTE_COLLECTION, то вимикаємо поле для лічильника
      setFormData({
        ...formData,
        [name]: value,
        counter: '',
        price: '', // Скидаємо значення лічильника при зміні типу послуги
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !(formData.utilities_type >= 0 && formData.utilities_type <= 4) ||
      !formData.date ||
      (formData.utilities_type !== 4 && !formData.counter) ||
      !formData.price
    ) {
      console.log(
        formData.utilities_type >= 0 && formData.utilities_type <= 4,
        formData.utilities_type
      );
      setErrorMessage('Будь ласка, заповніть усі поля');
      return;
    }

    const dataToSend = { ...formData };
    if (formData.utilities_type === 4) {
      delete dataToSend.counter; // Видалити поле counter
    }

    console.log(dataToSend);

    try {
      const response = await axios.post(
        `http://localhost:8765/api/utility/`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        }
      );
      setSuccessMessage('Запис успішно створено!'); // Встановлюємо повідомлення про успіх
      setTimeout(() => {
        navigate(`/utility-type-list/${id}`);
      }, 2000);
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;

        if (errorData.counter && Array.isArray(errorData.counter)) {
          setErrorMessage(errorData.counter[0]);
        } else if (errorData.error && Array.isArray(errorData.error)) {
          setErrorMessage(errorData.error[0]);
        } else {
          setErrorMessage(errorData.detail || 'Некоректно введені дані!');
        }
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
        <FormPaper title="Створення запису про комунальну послугу">
          <UtilityForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            errorMessage={errorMessage}
          />
        </FormPaper>
      </Box>
      <div style={{ height: '50px' }} />

      {/* Snackbar для повідомлення про успіх */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000} // Повідомлення буде зникати через 3 секунди
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{
          vertical: 'bottom', // Розташування знизу
          horizontal: 'center', // По центру
        }}
      >
        <Alert
          severity="success"
          onClose={() => setSuccessMessage(null)}
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UtilityCreatePage;
