import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useOutletContext, useParams} from "react-router-dom";
import useCheckOwnership from "../hooks/useCheckOwnership.tsx";
import axios from "axios";
import useFetchManagers from "../hooks/useFetchManagers.tsx";
import {Box, Button, Grid, Typography} from "@mui/material";
import FormPaper from "../components/RegisterForm/UI/FormPaper.tsx";
import TextFieldWithLabel from "../components/RegisterForm/UI/TextFieldWithLabel.tsx";
import SubmitButton from "../components/RegisterForm/UI/SubmitButton.tsx";
import useAccessToProvider from "../hooks/useAccessToProvider.tsx";

const ProviderCreatePage = () => {
    const {setText} = useOutletContext<{ setText: (text: React.ReactNode) => void }>();
    const {id} = useParams<{ id: string }>();
    useAccessToProvider(id);

    useEffect(() => {
        setText(<h2>Створити постачальника компанії</h2>);
    }, [setText]);

    const [formData, setFormData] = useState({
        address: '',
        name: '',
        email: '',
        phone_number: '',
        bank_details: '',
        company: '',
        company_id: id || '',
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.address || !formData.name || !formData.address) {
            setErrorMessage('Будь ласка, заповніть усі поля');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8765/api/provider/`,
                formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    },
                });
            navigate(`/provider-list/${id}`);
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.detail || 'Некоректно введені дані!');
            } else {
                setErrorMessage('Не вдалося з\'єднатися з сервером');
            }
        }
    };


    return (
        <>
            <div style={{height: '500px'}}/>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                }}
            >
                <FormPaper title="Створення постачальника">
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <TextFieldWithLabel
                                label="Ім'я постачальника *"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                            <TextFieldWithLabel
                                label="Електрона адреса *"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            <TextFieldWithLabel
                                label="Адреса *"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                            <TextFieldWithLabel
                                label="Номер телефону"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleInputChange}
                            />
                            <TextFieldWithLabel
                                label="Банківські реквізити"
                                name="bank_details"
                                value={formData.bank_details}
                                onChange={handleInputChange}
                            />
                            <ul>
                                <Typography variant="h6" gutterBottom>
                                    Правила створення постачальника:
                                </Typography>
                                <li>
                                    В одній компанії постачальник має мати унікальний номер телефону або електронну
                                    адресу.
                                </li>
                                <li>
                                    Банківські реквізити не можуть повторюватися.
                                </li>
                                <li>
                                    Поле "Електронна адреса" або "Номер телефону" може бути пустим, але щонайменше одне
                                    з них обов'язково має бути заповнене.
                                </li>
                            </ul>

                            <SubmitButton text="Створити постачальника" onSubmit={handleSubmit}/>
                        </Grid>
                    </form>
                    {errorMessage && (
                        <Typography color="error" sx={{marginTop: '10px'}}>
                            {errorMessage}
                        </Typography>
                    )}
                    <div style={{height: '15px'}}/>
                    <hr/>
                    <Link to={`/provider-list/${id}`} style={{textDecoration: 'none', color: 'inherit'}}>
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
                                Перелік постачальників
                            </Button>
                        </Box>
                    </Link>
                </FormPaper>
            </Box>
            <div style={{height: '50px'}}/>
        </>
    );
};

export default ProviderCreatePage;