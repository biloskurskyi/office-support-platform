import React, {useEffect, useState} from 'react';
import {Link, useOutletContext, useParams} from "react-router-dom";
import axios from 'axios';
import {Box, Button, Grid, Typography} from "@mui/material";
import FormPaper from "../components/LoginForm/UI/FormPaper.tsx";
import CustomTextField from "../components/UserForm/UI/CustomTextField.tsx";
import UpdateButton from "../components/UserForm/UI/UpdateButton.tsx";

const OfficeEditPage = () => {
    const {setText} = useOutletContext<{ setText: (text: React.ReactNode) => void }>();

    useEffect(() => {

        setText(<h2>Налаштування сторінки офісу</h2>);
    }, [setText]);


    const {id} = useParams(); // Отримуємо id з URL
    const [company, setCompany] = useState(null);
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        country: '',
        postal_code: '',
        phone_number: '',
        company: '',

    });
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Завантаження даних компанії
    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const response = await axios.get(`http://localhost:8765/api/office/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    },
                });
                setCompany(response.data);
                setFormData({
                    address: response.data.address,
                    city: response.data.city,
                    country: response.data.country,
                    postal_code: response.data.postal_code,
                    phone_number: response.data.phone_number,
                    company: response.data.company,
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
            const response = await axios.patch(`http://localhost:8765/api/office/${id}/`, formData, {
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
                                label="Країна"
                                value={formData.country}
                                name="description"
                                onChange={handleInputChange}
                            />
                            <CustomTextField
                                label="Місто"
                                value={formData.city}
                                name="name"
                                onChange={handleInputChange}
                            />
                            <CustomTextField
                                label="Адресса"
                                value={formData.address}
                                name="legal_name"
                                onChange={handleInputChange}
                            />
                            <CustomTextField
                                label="Поштовий індекс"
                                value={formData.postal_code}
                                name="website"
                                onChange={handleInputChange}
                            />
                             <CustomTextField
                                label="Номер телефону"
                                value={formData.phone_number}
                                name="website"
                                onChange={handleInputChange}
                            />
                            <CustomTextField
                                label="Компанія"
                                value={formData.company}
                                name="website"
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

                    <Link to="/main" style={{textDecoration: 'none', color: 'inherit'}}>
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
                                Перелік офісів
                            </Button>
                        </Box>
                    </Link>


                </FormPaper>
            </Box>

            <div style={{height: '50px'}}/>
        </div>
    );
};

export default OfficeEditPage;