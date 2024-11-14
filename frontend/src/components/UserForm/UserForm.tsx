import React, {useState, useEffect} from 'react';
import {TextField, Grid, Box, Typography, Button} from '@mui/material';
import useUserData from "../../hooks/useUserData.tsx"; // Хук для отримання даних користувача
import FormPaper from "../../components/LoginForm/UI/FormPaper.tsx"; // Ваш компонент FormPaper (якщо є)

const UserForm = () => {
    const {userData, loading, error} = useUserData();
    const [formData, setFormData] = useState({
        surname: '',
        name: '',
        email: '',
    });

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
    const handleSubmit = (e) => {
        e.preventDefault();
        // Тут можна додати логіку для оновлення даних користувача
        console.log(formData);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading user data.</div>;

    const isOwner = userData?.user_type === 1;
    const isManager = userData?.user_type === 2;

    return (
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px'}}>
            <FormPaper title="Редагування профілю">
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* Прізвище */}
                        <Grid item xs={12}>
                            <TextField
                                label="Прізвище"
                                name="surname"
                                value={formData.surname}
                                onChange={handleInputChange}
                                fullWidth
                                disabled
                                InputProps={{
                                    style: {color: '#000'}, // Колір тексту в полі
                                }}
                                InputLabelProps={{
                                    style: {color: '#000'}, // Колір лейблу
                                }}
                                sx={{
                                    marginBottom: '10px',
                                }}
                            />
                        </Grid>
                        {/* Ім'я */}
                        <Grid item xs={12}>
                            <TextField
                                label="Ім'я"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                fullWidth
                                disabled
                                InputProps={{
                                    style: {color: '#000'}, // Колір тексту в полі
                                }}
                                InputLabelProps={{
                                    style: {color: '#000'}, // Колір лейблу
                                }}
                                sx={{
                                    marginBottom: '10px',
                                }}
                            />
                        </Grid>
                        {/* Емейл */}
                        <Grid item xs={12}>
                            <TextField
                                label="Емейл"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                fullWidth
                                disabled
                                InputProps={{
                                    style: {color: '#000'}, // Колір тексту в полі
                                }}
                                InputLabelProps={{
                                    style: {color: '#000'}, // Колір лейблу
                                }}
                                sx={{
                                    marginBottom: '10px',
                                }}
                            />
                        </Grid>
                        {/* Дата реєстрації */}
                        <Grid item xs={12}>
                            <TextField
                                label="Дата реєстрації"
                                value={new Date(userData.date_joined).toLocaleDateString()}
                                fullWidth
                                disabled
                                InputProps={{
                                    style: {color: '#000'}, // Колір тексту в полі
                                }}
                                InputLabelProps={{
                                    style: {color: '#000'}, // Колір лейблу
                                }}
                                sx={{
                                    marginBottom: '10px',
                                }}
                            />
                        </Grid>
                        {/* Тип користувача */}
                        <Grid item xs={12}>
                            <TextField
                                label="Тип користувача"
                                value={isOwner ? 'Власник' : isManager ? 'Менеджер' : 'Невідомий'}
                                fullWidth
                                disabled
                                InputProps={{
                                    style: {color: '#000'}, // Колір тексту в полі
                                }}
                                InputLabelProps={{
                                    style: {color: '#000'}, // Колір лейблу
                                }}
                                sx={{
                                    marginBottom: '10px',
                                }}
                            />
                        </Grid>

                        {isManager && (
                            <>
                                {/* Компанія */}
                                <Grid item xs={12}>
                                    <TextField
                                        label="Компанія"
                                        value={userData.company || "Немає компанії"}
                                        fullWidth
                                        disabled
                                        InputProps={{
                                            style: {color: '#000'}, // Колір тексту в полі
                                        }}
                                        InputLabelProps={{
                                            style: {color: '#000'}, // Колір лейблу
                                        }}
                                        sx={{
                                            marginBottom: '10px',
                                        }}
                                    />
                                </Grid>
                                {/* Активність */}
                                <Grid item xs={12}>
                                    <TextField
                                        label="Активність"
                                        value={userData.is_active ? "Активний" : "Неактивний"}
                                        fullWidth
                                        disabled
                                        InputProps={{
                                            style: {color: '#000'}, // Колір тексту в полі
                                        }}
                                        InputLabelProps={{
                                            style: {color: '#000'}, // Колір лейблу
                                        }}
                                        sx={{
                                            marginBottom: '10px',
                                        }}
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>

                    <Box sx={{marginTop: '10px', marginBottom: '30px'}}>
                        <Button variant="contained" color="primary" fullWidth type="submit">
                            Оновити дані
                        </Button>
                    </Box>

                    <hr/>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '30px',
                    }}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            sx={{
                                backgroundColor: '#f44336', // Червоний колір для виділення
                                color: '#fff',
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: '#d32f2f', // Трохи темніший колір при наведенні
                                }
                            }}
                        >
                            Змінити пароль
                        </Button>
                    </Box>
                </form>
            </FormPaper>
        </Box>
    );
};

export default UserForm;
