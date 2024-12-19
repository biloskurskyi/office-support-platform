import React, {useEffect, useState} from 'react';
import {Link, useOutletContext, useParams} from "react-router-dom";
import axios from 'axios';
import {Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import FormPaper from "../components/LoginForm/UI/FormPaper.tsx";
import CustomTextField from "../components/UserForm/UI/CustomTextField.tsx";
import UpdateButton from "../components/UserForm/UI/UpdateButton.tsx";
import useFetchManagersData from "../hooks/useFetchManagersData.tsx";

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
        company_id: '',
        manager: '',

    });
    const [loadingData, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { managers, loading, error } = useFetchManagersData(
    id ? `http://localhost:8765/api/office/${id}/managers/` : null
);

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
                    company_id: response.data.company_id,
                    manager: response.data.manager,
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
            const response = await axios.put(`http://localhost:8765/api/office/${id}/`, formData, {
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

    if (loadingData) return <div>Завантаження...</div>;

    const userType = localStorage.getItem('user_type');
    let linkTo = '';
    if (userType == 2) {
        linkTo = '/main';  // Для менеджера
    } else if (userType == 1 && company.company_id) {
        linkTo = `/office-list/${company.company_id}`;
    }


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
                                name="country"
                                onChange={handleInputChange}
                            />
                            <CustomTextField
                                label="Місто"
                                value={formData.city}
                                name="city"
                                onChange={handleInputChange}
                            />
                            <CustomTextField
                                label="Адресса"
                                value={formData.address}
                                name="address"
                                onChange={handleInputChange}
                            />
                            <CustomTextField
                                label="Поштовий індекс"
                                value={formData.postal_code}
                                name="postal_code"
                                onChange={handleInputChange}
                            />
                            <CustomTextField
                                label="Номер телефону"
                                value={formData.phone_number}
                                name="phone_number"
                                onChange={handleInputChange}
                            />
                            <CustomTextField
                                label="Компанія"
                                value={formData.company}
                                name="company"
                                disabled
                            />
                            {localStorage.getItem("user_type") === "1" && (<Grid item xs={12}>
                                <FormControl
                                    fullWidth
                                    sx={{
                                        marginTop: '10px',
                                        marginBottom: '10px',
                                        '.MuiInputLabel-root': {
                                            backgroundColor: '#fff',
                                            padding: '0 5px',
                                            transform: 'translate(14px, -6px) scale(0.75)',
                                        },
                                        '.MuiSelect-select': {
                                            padding: '16px',
                                        },
                                    }}
                                >
                                    <InputLabel
                                        id="manager-select-label"
                                        sx={{
                                            fontSize: '16px',
                                            fontWeight: '500',
                                        }}
                                    >
                                        Менеджер
                                    </InputLabel>
                                    <Select
                                        labelId="manager-select-label"
                                        id="manager-select"
                                        value={formData.manager}
                                        name="manager"
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        displayEmpty
                                        sx={{
                                            borderRadius: '8px',
                                            border: '0px solid #ccc',
                                            ':focus': {
                                                borderColor: '#1976d2',
                                            },
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>Не вибрано</em>
                                        </MenuItem>
                                        {managers.map((manager: { id: number; name: string; email: string }) => (
                                            <MenuItem
                                                key={manager.id}
                                                value={manager.id}
                                                sx={{
                                                    whiteSpace: 'normal',
                                                    wordBreak: 'break-word',
                                                    lineHeight: '1.5',
                                                }}
                                            >
                                                {manager.name} з електроною адресою: {manager.email}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>)}
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

                    <Link to={linkTo} style={{textDecoration: 'none', color: 'inherit'}}>
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