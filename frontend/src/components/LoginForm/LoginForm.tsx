// src/components/LoginForm.tsx
import React, {useState} from 'react';
import {Box, Grid, Typography} from '@mui/material';
import FormPaper from './UI/FormPaper';
import TextFieldWithLabel from './UI/TextFieldWithLabel';
import SubmitButton from './UI/SubmitButton';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
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

        try {
            const response = await axios.post('http://localhost:8765/api/login/', formData);
            localStorage.setItem('jwtToken', response.data.token);
            navigate('/main');
        } catch (error) {
            setErrorMessage('Невірний логін або пароль');
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
                        <SubmitButton text="Увійти" onSubmit={handleSubmit}/>
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

export default LoginForm;
