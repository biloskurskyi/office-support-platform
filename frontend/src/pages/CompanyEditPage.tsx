import {Link, useNavigate, useOutletContext, useParams} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import FormPaper from "../components/LoginForm/UI/FormPaper.tsx";
import axios from 'axios';
import {Button, Grid, Box, Typography} from '@mui/material';
import CustomTextField from "../components/UserForm/UI/CustomTextField.tsx"
import UpdateButton from "../components/UserForm/UI/UpdateButton.tsx";

const CompanyEditPage = () => {
    const { setText } = useOutletContext<{ setText: (text: React.ReactNode) => void }>();
    const navigate = useNavigate();

    useEffect(() => {

        setText(<h2>Налаштування сторінки компанії</h2>);
    }, [setText]);


    const {id} = useParams(); // Отримуємо id з URL
    const [company, setCompany] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        legal_name: '',
        description: '',
        website: '',
        created_at: '',
    });
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Завантаження даних компанії
    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const response = await axios.get(`http://localhost:8765/api/company/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    },
                });
                setCompany(response.data);
                setFormData({
                    name: response.data.name,
                    legal_name: response.data.legal_name,
                    description: response.data.description,
                    website: response.data.website,
                    created_at: response.data.created_at,
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching company data:', error);
                setErrorMessage('Помилка завантаження даних компанії.');
                setLoading(false);
                navigate("/error");
            }
        };

        fetchCompanyData();
    }, [id, navigate]);

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
            const response = await axios.patch(`http://localhost:8765/api/company/${id}/`, formData, {
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
                                label="Назва компанії"
                                value={formData.name}
                                name="name"
                                onChange={handleInputChange}
                            />
                            <CustomTextField
                                label="Юридична назва"
                                value={formData.legal_name}
                                name="legal_name"
                                onChange={handleInputChange}
                            />
                            <CustomTextField
                                label="Опис"
                                value={formData.description}
                                name="description"
                                onChange={handleInputChange}
                            />
                            <CustomTextField
                                label="Сайт"
                                value={formData.website}
                                name="website"
                                onChange={handleInputChange}
                            />
                            <CustomTextField
                                label="Дата реєстрації"
                                value={new Date(formData.created_at).toLocaleDateString()}
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
                                Перелік компаній
                            </Button>
                        </Box>
                    </Link>


                </FormPaper>
            </Box>
            <div style={{height: '50px'}}/>
        </div>
    );
};

export default CompanyEditPage;
