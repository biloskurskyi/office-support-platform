import React, {useState} from 'react';
import {Box, Grid, Typography} from '@mui/material';
import FormPaper from './UI/FormPaper';
import TextFieldWithLabel from './UI/TextFieldWithLabel';
import SubmitButton from './UI/SubmitButton';
import {useNavigate} from "react-router-dom";
import axios from "axios";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        confirmPassword: '',
        user_type: 1
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

        if (!formData.name || !formData.surname || !formData.email || !formData.password || !formData.confirmPassword) {
            setErrorMessage('Будь ласка, заповніть усі поля');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Паролі не співпадають');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8765/api/register/', formData);
            navigate('/login?message=User created successfully.');
        } catch (error) {
            // Перевіряємо тип помилки
            if (error.response) {
                // Сервер повернув помилку
                if (error.response.status === 400) {
                    if (error.response.data.message === "Email is already taken") {
                        setErrorMessage('Ця пошта вже зареєстрована');
                    } else if (error.response.data.message === "Password confirmation does not match") {
                        setErrorMessage('Паролі не співпадають');
                    } else {
                        console.log(formData)
                        setErrorMessage('Невірно введена електронна адреса або користувач' +
                            ' з такою адресою вже існує');
                    }
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
            <FormPaper title="Реєстрація">
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* Ім'я */}
                        <TextFieldWithLabel
                            label="Ім'я *"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        {/* Прізвище */}
                        <TextFieldWithLabel
                            label="Прізвище *"
                            name="surname"
                            value={formData.surname}
                            onChange={handleInputChange}
                        />
                        {/* Емейл */}
                        <TextFieldWithLabel
                            label="Емейл *"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        {/* Пароль */}
                        <TextFieldWithLabel
                            label="Пароль *"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            type="password"
                        />
                        {/* Підтвердження пароля */}
                        <TextFieldWithLabel
                            label="Підтвердження пароля *"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            type="password"
                        />
                        {/* Кнопка реєстрації */}
                        <SubmitButton text="Зареєструватися" onSubmit={handleSubmit}/>
                    </Grid>
                </form>
                {errorMessage && (
                    <Typography color="error" sx={{marginTop: '10px'}}>
                        {errorMessage}
                    </Typography>
                )}
            </FormPaper>
        </Box>
    );
};

export default RegisterForm;
