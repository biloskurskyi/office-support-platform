import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useOutletContext, useParams} from "react-router-dom";
import axios from "axios";
import FormPaper from "../components/RegisterForm/UI/FormPaper.tsx";
import {Box, Button, Grid, Typography} from "@mui/material";
import TextFieldWithLabel from "../components/RegisterForm/UI/TextFieldWithLabel.tsx";
import SubmitButton from "../components/RegisterForm/UI/SubmitButton.tsx";
import useCheckOwnership from "../hooks/useCheckOwnership.tsx";

const ManagerCreatePage = () => {
    const {setText} = useOutletContext<{ setText: (text: React.ReactNode) => void }>();
    const {id} = useParams<{ id: string }>();

    useEffect(() => {
        setText(<h2>Створити менеджера компанії</h2>);
    }, [setText]);

    useCheckOwnership(id);

    const [formData, setFormData] = useState({
        surname: '',
        name: '',
        email: '',
        info: '',
        company: id || '',
        user_type: 2
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

        // Перевірка на обов'язкові поля
        if (!formData.name || !formData.surname || !formData.email || !formData.company) {
            setErrorMessage('Будь ласка, заповніть усі поля');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8765/api/register-manager/',
                formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    },
                });
            navigate(`/company/${id}/managers`); // Переходимо на сторінку зі списком менеджерів після успішного створення
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.detail || 'Щось пішло не так');
            } else {
                setErrorMessage('Не вдалося з\'єднатися з сервером');
            }
        }
    };

    return (
        <div>
            <div style={{height: '500px'}}/>
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
                                label="Електрона пошта *"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            {/* Пароль */}
                            <TextFieldWithLabel
                                label="Інформація"
                                name="info"
                                value={formData.info}
                                onChange={handleInputChange}
                            />
                            {/* Кнопка реєстрації */}
                            <SubmitButton text="Створити менеджера" onSubmit={handleSubmit}/>
                        </Grid>
                    </form>
                    {errorMessage && (
                        <Typography color="error" sx={{marginTop: '10px'}}>
                            {errorMessage}
                        </Typography>
                    )}
                    <div style={{height: '15px'}}/>
                    <hr/>
                    <Link to={`/company/${id}/managers`} style={{textDecoration: 'none', color: 'inherit'}}>
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
                                    backgroundColor: '#58d68d',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        backgroundColor: '#1d8348',
                                    }
                                }}
                            >
                                Перелік менеджерів
                            </Button>
                        </Box>
                    </Link>
                </FormPaper>
            </Box>
            <div style={{height: '50px'}}/>
        </div>
    );
};

export default ManagerCreatePage;