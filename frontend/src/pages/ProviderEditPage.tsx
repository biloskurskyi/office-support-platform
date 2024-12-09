import React, {useEffect, useState} from 'react';
import {Link, useOutletContext, useParams} from "react-router-dom";
import axios from "axios";
import {Box, Button, Grid, Typography} from "@mui/material";
import FormPaper from "../components/LoginForm/UI/FormPaper.tsx";
import CustomTextField from "../components/UserForm/UI/CustomTextField.tsx";
import UpdateButton from "../components/UserForm/UI/UpdateButton.tsx";

const ProviderEditPage = () => {
    const {setText} = useOutletContext<{ setText: (text: React.ReactNode) => void }>();

    useEffect(() => {

        setText(<h2>Налаштування постачальника</h2>);
    }, [setText]);

    const {id} = useParams(); // Отримуємо id з URL
    const [provider, setProvider] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone_number: '',
        email: '',
        company: '',
        company_id: '',
        bank_details: '',

    });
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Завантаження даних компанії
    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const response = await axios.get(`http://localhost:8765/api/provider/${id}/`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                        },
                    });
                setProvider(response.data);
                setFormData({
                    name: response.data.name,
                    address: response.data.address,
                    phone_number: response.data.phone_number,
                    email: response.data.email,
                    company: response.data.company,
                    company_id: response.data.company_id,
                    bank_details: response.data.bank_details,
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching company data:', error);
                setErrorMessage('Помилка завантаження даних компанії.');
                setLoading(false);
            }
        };

        fetchCompanyData();
    }, [id]);

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
            const response = await axios.put(`http://localhost:8765/api/provider/${id}/`,
                formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    },
                });
            console.log('Company updated successfully:', response.data);
            setSuccessMessage('Дані компанії оновлено успішно');
            setErrorMessage('');
        } catch (err) {
            console.error('Error updating company data:', err);
            setErrorMessage('Помилка оновлення даних.');
            setSuccessMessage('');
        }
    };

    if (loading) return <div>Завантаження...</div>;


    return (
        <div>
            <div style={{height: '500px'}}/>

            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px'}}>
                <FormPaper title="Оновити дані">
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <CustomTextField
                                label="Назва"
                                value={formData.name}
                                name="name"
                                onChange={handleInputChange}
                            />
                            <CustomTextField
                                label="Адреса"
                                value={formData.address}
                                name="address"
                                onChange={handleInputChange}
                            />
                            <CustomTextField
                                label="Номер телефону"
                                value={formData.phone_number}
                                name="phone_number"
                                onChange={handleInputChange}
                            />
                            <CustomTextField
                                label="Електроний лист"
                                value={formData.email}
                                name="email"
                                onChange={handleInputChange}
                            />
                            <CustomTextField
                                label="Банківські реквізити"
                                value={formData.bank_details}
                                name="bank_details"
                                onChange={handleInputChange}
                            />
                            <CustomTextField
                                label="Компанія"
                                value={formData.company}
                                name="company"
                                disabled
                            />
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

                    </form>

                    <hr/>

                    <Link to={`/provider-list/${provider.company_id}`}
                          style={{textDecoration: 'none', color: 'inherit'}}>
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
        </div>
    );
};

export default ProviderEditPage;