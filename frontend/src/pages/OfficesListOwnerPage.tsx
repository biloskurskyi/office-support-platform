import React, {useEffect, useState} from 'react';
import axios, {AxiosResponse} from 'axios';
import {useOutletContext, useParams} from 'react-router-dom';
import {
    Typography,
    CircularProgress,
    Box,
    Button,
    Card,
    CardContent, CardActions
} from '@mui/material';
import InfoBlocks from "../components/MainPageComponents/UI/InfoBlocks.tsx";
import PageWrapper from "../components/MainPageComponents/PageWrapper.tsx";
import ErrorMessage from "../components/OfficesListOwnerComponent/UI/ErrorMessage.tsx";
import OfficeCard from "../components/OfficesListOwnerComponent/UI/OfficeCard.tsx";

interface Office {
    id: number;
    city: string;
    address: string;
    country: string;
    postal_code: string;
    phone_number: string;
}

const OfficesListOwnerPage = () => {
    const {setText} = useOutletContext<{ setText: (text: React.ReactNode) => void }>();

    useEffect(() => {

        setText(<h2>Перелік офісів для комапнії </h2>);
    }, [setText]);

    const {id} = useParams<{ id: string }>();
    const [offices, setOffices] = useState<Office[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const userType = localStorage.getItem('user_type');

                if (!token) {
                    setError('Необхідно авторизуватися.');
                    return;
                }

                if (userType !== '1') {
                    setError('У вас немає прав для перегляду офісів.');
                    return;
                }

                const response: AxiosResponse<Office[]> = await axios.get(
                    `http://localhost:8765/api/office-list-company/${id}/`,
                    {
                        headers: {Authorization: `Bearer ${token}`},
                    }
                );
                setOffices(response.data);
            } catch (error) {
                setError('Не вдалося завантажити офіси. Спробуйте пізніше.');
                console.error('Помилка завантаження даних:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <CircularProgress/>;
    }

    if (error) return <ErrorMessage message={error}/>;

    if (!offices.length) {
        return (
            <>
                <div style={{height: '500px'}}/>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '400px',
                        textAlign: 'center',
                        color: '#555',
                    }}
                >
                    <Card
                        sx={{
                            maxWidth: 400,
                            padding: '20px',
                            borderRadius: '12px',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="h5"
                                component="div"
                                sx={{marginBottom: '16px', fontWeight: 'bold', color: '#333'}}
                            >
                                Офіси не знайдено
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Здається, у цієї компанії ще немає офісів. Ви можете створити новий офіс за допомогою
                                кнопки
                                нижче.
                            </Typography>
                        </CardContent>
                        <CardActions sx={{justifyContent: 'center'}}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#1976d2',
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: '#155a9c',
                                    },
                                }}
                            >
                                Створити офіс
                            </Button>
                        </CardActions>
                    </Card>
                </Box>
            </>

        );
    }


    return (
        <PageWrapper>
            <div style={{height: '500px'}}/>
            <InfoBlocks
                blocksData={offices.map((office) => ({
                    title: office.city,
                    content: <OfficeCard office={office}/>,
                }))}
            />
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
            }}>
                {/*тут повина бути кнопка для створення офісів*/}
            </Box>
        </PageWrapper>
    );
};

export default OfficesListOwnerPage;
