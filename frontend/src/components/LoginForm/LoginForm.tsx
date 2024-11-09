// src/components/LoginForm.tsx
import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import FormPaper from './UI/FormPaper';
import TextFieldWithLabel from './UI/TextFieldWithLabel';
import SubmitButton from './UI/SubmitButton';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
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
            <FormPaper title="Вхід до системи">
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
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
                        {/* Кнопка авторизації */}
                        <SubmitButton text="Увійти" onSubmit={handleSubmit} />
                    </Grid>
                </form>
            </FormPaper>
        </Box>
    );
};

export default LoginForm;
