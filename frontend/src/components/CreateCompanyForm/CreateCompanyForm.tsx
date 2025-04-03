import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormPaper from '../RegisterForm/UI/FormPaper.tsx';
import { Box, Grid, Typography } from '@mui/material';
import TextFieldWithLabel from '../RegisterForm/UI/TextFieldWithLabel.tsx';
import SubmitButton from '../RegisterForm/UI/SubmitButton.tsx';

const CreateCompanyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    legal_name: '',
    description: '',
    website: '',
    created_at: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.legal_name) {
      setErrorMessage('Будь ласка, заповніть усі необхідні поля');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8765/api/company/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        }
      );
      setSuccessMessage('Компанію успішно створено!');
      setErrorMessage(null);

      setFormData({
        name: '',
        legal_name: '',
        description: '',
        website: '',
        created_at: '',
      });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          console.log(formData);
          setErrorMessage(
            'Невірно введені данні, ' +
              'або компанія з такою юридичною особою вже існує в системі'
          );
        } else {
          setErrorMessage('Сталася помилка на сервері');
        }
      } else {
        setErrorMessage('Не вдалося підключитися до сервера');
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
      }}
    >
      <FormPaper title="Створення компанії">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <TextFieldWithLabel
              label="Ім'я компанії *"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <TextFieldWithLabel
              label="Юридична особа *"
              name="legal_name"
              value={formData.legal_name}
              onChange={handleInputChange}
            />
            <TextFieldWithLabel
              label="Опис"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
            <TextFieldWithLabel
              label="Веб-сайт"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              // type="password"
            />

            <ul>
              <Typography variant="h6" gutterBottom>
                Правила створення компанії:
              </Typography>
              <li>
                При створенні компанії потрібно обов'язково надати загальну
                назву та юридичну (унікальну назву, яка відрізняє компанію в
                системі).
              </li>
            </ul>

            <SubmitButton text="Створити компанію" onSubmit={handleSubmit} />
          </Grid>
        </form>
        {errorMessage && (
          <Typography color="error" sx={{ marginTop: '10px' }}>
            {errorMessage}
          </Typography>
        )}

        {successMessage && (
          <Typography
            color="success.main"
            sx={{ marginTop: '10px', color: 'green' }}
          >
            {successMessage}
          </Typography>
        )}
      </FormPaper>
    </Box>
  );
};

export default CreateCompanyForm;
