import React, {useEffect, useState} from 'react';
import {useOutletContext, useParams} from "react-router-dom";
import axios, {AxiosResponse} from "axios";
import {Box, Button, Card, CardActions, CardContent, CircularProgress, Typography} from "@mui/material";
import ErrorMessage from "../components/OfficesListOwnerComponent/UI/ErrorMessage.tsx";
import InfoBlocks from "../components/MainPageComponents/UI/InfoBlocks.tsx";
import PageWrapper from "../components/MainPageComponents/PageWrapper.tsx";
import ManagerCard from "../components/ManagerCard/UI/ManagerCard.tsx";

interface Manager {
    id: number;
    surname: string,
    name: string,
    email: string,
    user_type: number,
    info: string,
    company: number,
    is_active: boolean,
}

const ManagersListPage = () => {
    const {setText} = useOutletContext<{ setText: (text: React.ReactNode) => void }>();

    useEffect(() => {

        setText(<h2>Перелік менеджерів компанії</h2>);
    }, [setText]);

    const {id} = useParams<{ id: string }>();
    const [managers, setManagers] = useState<Manager[]>([]);
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

                const response: AxiosResponse<Manager[]> = await axios.get(
                    `http://localhost:8765/api/company/${id}/managers/`,
                    {
                        headers: {Authorization: `Bearer ${token}`},
                    }
                );
                setManagers(response.data);
            } catch (error) {
                setError('Не вдалося завантажити менеджерів. Спробуйте пізніше.');
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

    if (!managers.length) {
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
                                Менеджерів не знайдено
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Здається, у цієї компанії ще немає менеджерів. Ви можете створити нового менеджера
                                за допомогою кнопки нижче.
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
                                Створити менеджера
                            </Button>
                        </CardActions>
                    </Card>
                </Box>
            </>

        );
    }

    return (
        <div>
            <PageWrapper>
                <div style={{height: '500px'}}/>
                <InfoBlocks
                    blocksData={managers.map((manager) => ({
                        title: manager.email,
                        content: <ManagerCard manager={manager}/>,
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

        </div>
    );
};

export default ManagersListPage;