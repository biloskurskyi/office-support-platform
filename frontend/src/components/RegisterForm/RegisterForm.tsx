// src/components/RegisterForm.tsx
import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import FormPaper from './UI/FormPaper';
import TextFieldWithLabel from './UI/TextFieldWithLabel';
import SubmitButton from './UI/SubmitButton';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
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
                            label="Ім'я"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        {/* Емейл */}
                        <TextFieldWithLabel
                            label="Емейл"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        {/* Пароль */}
                        <TextFieldWithLabel
                            label="Пароль"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            type="password"
                        />
                        {/* Підтвердження пароля */}
                        <TextFieldWithLabel
                            label="Підтвердження пароля"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            type="password"
                        />
                        {/* Кнопка реєстрації */}
                        <SubmitButton text="Зареєструватися" onSubmit={handleSubmit} />
                    </Grid>
                </form>
            </FormPaper>
        </Box>
    );
};

export default RegisterForm;
