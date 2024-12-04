import React, {useState} from 'react';
import {Grid, TextField, Button, Box, Typography} from '@mui/material';
import FormPaper from "../../components/LoginForm/UI/FormPaper.tsx";
import axios from "axios";
import {Link} from "react-router-dom";
import {AccountCircle} from "@mui/icons-material";
import UserPageButton from "./UI/UserPageButton.tsx";
import ChangePasswordButton from "./UI/ChangePasswordButton.tsx";

const ChangePasswordForm = () => {
    const [formData, setFormData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {old_password, new_password, confirm_password} = formData;

        // Валідація паролів
        if (new_password !== confirm_password) {
            setErrorMessage('Нові паролі не співпадають.');
            setSuccessMessage('');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8765/api/change-password/', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                },
            });
            console.log('Password updated successfully:', response.data);
            setSuccessMessage('Пароль успішно змінено!');
            setErrorMessage('');
        } catch (err) {
            setErrorMessage('Не вдалося змінити пароль. Спробуйте ще раз.');
            setSuccessMessage('');
        }
    };

    // Таймер для очищення повідомлень
    React.useEffect(() => {
        if (successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 10000); // 10 секунд

            return () => clearTimeout(timer);
        }
    }, [successMessage, errorMessage]);

    return (
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px'}}>
            <FormPaper title="Змінити пароль">
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* Поточний пароль */}
                        <Grid item xs={12}>
                            <TextField
                                label="Поточний пароль"
                                name="old_password" // Назва поля повинна відповідати обраному імені в formData
                                type="password"
                                value={formData.old_password}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                InputProps={{
                                    style: {color: '#000'},
                                }}
                                InputLabelProps={{
                                    style: {color: '#000'},
                                }}
                            />
                        </Grid>
                        {/* Новий пароль */}
                        <Grid item xs={12}>
                            <TextField
                                label="Новий пароль"
                                name="new_password" // Назва поля повинна відповідати обраному імені в formData
                                type="password"
                                value={formData.new_password}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                InputProps={{
                                    style: {color: '#000'},
                                }}
                                InputLabelProps={{
                                    style: {color: '#000'},
                                }}
                            />
                        </Grid>
                        {/* Підтвердження нового пароля */}
                        <Grid item xs={12}>
                            <TextField
                                label="Підтвердження нового пароля"
                                name="confirm_password" // Назва поля повинна відповідати обраному імені в formData
                                type="password"
                                value={formData.confirm_password}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                InputProps={{
                                    style: {color: '#000'},
                                }}
                                InputLabelProps={{
                                    style: {color: '#000'},
                                }}
                            />
                        </Grid>
                    </Grid>

                    {/* Повідомлення про успіх або помилку */}
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

                    <ChangePasswordButton/>
                    <div style={{height: '5px'}}/>
                    <hr/>

                    <UserPageButton/>


                </form>


            </FormPaper>
        </Box>
    );
};

export default ChangePasswordForm;
