import React, { useEffect, useState } from 'react';
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import FormPaper from '../components/RegisterForm/UI/FormPaper.tsx';
import TextFieldWithLabel from '../components/RegisterForm/UI/TextFieldWithLabel.tsx';
import SubmitButton from '../components/RegisterForm/UI/SubmitButton.tsx';
import CustomTextField from '../components/UserForm/UI/CustomTextField.tsx';
import useFetchManagers from '../hooks/useFetchManagers.tsx';
import useCheckOwnership from '../hooks/useCheckOwnership.tsx';
import useFetchManagersData from '../hooks/useFetchManagersData.tsx';

const OfficeCreatePage = () => {
  const { setText } = useOutletContext<{
    setText: (text: React.ReactNode) => void;
  }>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    setText(<h2>Створити офіс компанії</h2>);
  }, [setText]);

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    country: '',
    postal_code: '',
    phone_number: '',
    manager: '',
    company_id: id || '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useCheckOwnership(id);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.country ||
      !formData.city ||
      !formData.address ||
      !formData.phone_number
    ) {
      setErrorMessage('Будь ласка, заповніть усі поля');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8765/api/office/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        }
      );
      navigate(`/office-list/${id}`); // Переходимо на сторінку зі списком менеджерів після успішного створення
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          error.response.data.detail ||
            'Некоректно введені дані,' +
              ' або офіс з таким номером телефону вже існує'
        );
      } else {
        setErrorMessage("Не вдалося з'єднатися з сервером");
      }
    }
  };

  const { managers, loading, error } = useFetchManagersData(
    id ? `http://localhost:8765/api/company/${id}/managers/` : null
  );

  return (
    <div>
      <div style={{ height: '500px' }} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '10px',
        }}
      >
        <FormPaper title="Реєстрація">
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <CustomTextField
                label="Країна *"
                value={formData.country}
                name="country"
                onChange={handleInputChange}
              />
              <CustomTextField
                label="Місто *"
                value={formData.city}
                name="city"
                onChange={handleInputChange}
              />
              <CustomTextField
                label="Адресса *"
                value={formData.address}
                name="address"
                onChange={handleInputChange}
              />
              <CustomTextField
                label="Поштовий індекс"
                value={formData.postal_code}
                name="postal_code"
                onChange={handleInputChange}
              />
              <CustomTextField
                label="Номер телефону *"
                value={formData.phone_number}
                name="phone_number"
                onChange={handleInputChange}
              />

              {/* Вибір менеджера */}
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  sx={{
                    marginTop: '10px',
                    marginBottom: '10px',
                    '.MuiInputLabel-root': {
                      backgroundColor: '#fff',
                      padding: '0 5px',
                      transform: 'translate(14px, -6px) scale(0.75)',
                    },
                    '.MuiSelect-select': {
                      padding: '16px',
                    },
                  }}
                >
                  <InputLabel
                    id="manager-select-label"
                    sx={{
                      fontSize: '16px',
                      fontWeight: '500',
                    }}
                  >
                    Менеджер
                  </InputLabel>
                  <Select
                    labelId="manager-select-label"
                    id="manager-select"
                    value={formData.manager}
                    name="manager"
                    onChange={handleInputChange}
                    disabled={loading}
                    displayEmpty
                    sx={{
                      borderRadius: '8px',
                      border: '0px solid #ccc',
                      ':focus': {
                        borderColor: '#1976d2',
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Не вибрано</em>
                    </MenuItem>
                    {managers.map(
                      (manager: {
                        id: number;
                        name: string;
                        email: string;
                      }) => (
                        <MenuItem
                          key={manager.id}
                          value={manager.id}
                          sx={{
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            lineHeight: '1.5',
                          }}
                        >
                          {manager.name} з електроною адресою: {manager.email}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </Grid>

              <ul>
                <Typography variant="h6" gutterBottom>
                  Правила створення офісу:
                </Typography>
                <li>
                  При створенні офісу він автоматично прив'язується до компанії,
                  в якій його створили.
                </li>
                <li>
                  Обов'язково потрібно заповнити місце розташування офісу.
                </li>
                <li>
                  Якщо в компанії є зареєстровані менеджери, то можна вибрати
                  менеджера, який буде мати доступ до управління цим офісом.
                </li>
              </ul>

              <SubmitButton text="Створити офіс" onSubmit={handleSubmit} />
            </Grid>
          </form>
          {errorMessage && (
            <Typography color="error" sx={{ marginTop: '10px' }}>
              {errorMessage}
            </Typography>
          )}
          <div style={{ height: '15px' }} />
          <hr />
          <Link
            to={`/office-list/${id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '30px',
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                sx={{
                  backgroundColor: '#58d68d',
                  color: '#fff',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#1d8348',
                  },
                }}
              >
                Перелік офісів
              </Button>
            </Box>
          </Link>
        </FormPaper>
      </Box>
      <div style={{ height: '50px' }} />
    </div>
  );
};

export default OfficeCreatePage;
