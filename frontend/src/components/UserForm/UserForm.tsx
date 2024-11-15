import React, {useState, useEffect} from 'react';
import {TextField, Grid, Box, Typography, Button} from '@mui/material';
import useUserData from "../../hooks/useUserData.tsx"; // Хук для отримання даних користувача
import FormPaper from "../../components/LoginForm/UI/FormPaper.tsx";
import axios from 'axios';
import UpdateButton from "./UI/UpdateButton.tsx";
import ChangePassword from "./UI/ChangePassword.tsx";
import CustomTextField from "./UI/CustomTextField.tsx"

const UserForm = () => {
    const {userData, loading, error} = useUserData();
    const [formData, setFormData] = useState({
        surname: '',
        name: '',
        email: '',
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    useEffect(() => {
        if (userData) {
            setFormData({
                surname: userData.surname,
                name: userData.name,
                email: userData.email,
            });
        }
    }, [userData]);

    // Обробка зміни інпутів
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Обробка submit форми
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Надсилаємо запит на оновлення даних користувача
            const response = await axios.patch('http://localhost:8765/api/update-user/', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                },
            });
            console.log('Data updated successfully:', response.data);
            setSuccessMessage('Дані оновлено успішно');
            setErrorMessage('');
        } catch (err) {
            console.error('Error updating data:', err);
            setErrorMessage('Помилка оновлення даних.');
            setSuccessMessage('');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading user data.</div>;

    const isOwner = userData?.user_type === 1;
    const isManager = userData?.user_type === 2;




    return (
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px'}}>
            <FormPaper title="Оновити дані користувача">
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* Прізвище */}
                        <CustomTextField
                            label="Прізвище"
                            name="surname"
                            value={formData.surname}
                            onChange={handleInputChange}
                        />
                        {/* Ім'я */}
                        <CustomTextField
                            label="Ім'я"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        {/* Емейл */}
                        <CustomTextField
                            label="Емейл"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        {/* Дата реєстрації */}
                        <CustomTextField
                            label="Дата реєстрації"
                            value={new Date(userData.date_joined).toLocaleDateString()}
                            disabled
                        />
                        {/* Тип користувача */}
                        <CustomTextField
                            label="Тип користувача"
                            value={isOwner ? 'Власник' : isManager ? 'Менеджер' : 'Невідомий'}
                            disabled
                        />

                        {isManager && (
                            <>
                                {/* Компанія */}
                                <CustomTextField
                                    label="Компанія"
                                    value={userData.company || 'Немає компанії'}
                                    disabled
                                />
                                {/* Активність */}
                                <CustomTextField
                                    label="Активність"
                                    value={userData.is_active ? 'Активний' : 'Неактивний'}
                                    disabled
                                />
                            </>
                        )}
                    </Grid>

                    {successMessage && (
                        <Typography color="success.main" sx={{marginTop: '10px'}}>
                            {successMessage}
                        </Typography>
                    )}
                    {errorMessage && (
                        <Typography color="error.main" sx={{marginTop: '10px'}}>
                            {errorMessage}
                        </Typography>
                    )}

                    <UpdateButton/>

                    <hr/>

                    <ChangePassword/>

                </form>
            </FormPaper>
        </Box>
    );
};

export default UserForm;
