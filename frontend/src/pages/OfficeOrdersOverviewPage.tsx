import React, {useEffect, useState} from 'react';
import {useParams, useOutletContext, Link} from 'react-router-dom';
import {Button, Card, CardContent, CircularProgress, Grid, Typography} from "@mui/material";
import ErrorMessage from "../components/OfficesListOwnerComponent/UI/ErrorMessage.tsx";
import NoExistCard from "../components/NoExistCard/NoExistCard.tsx";
import useFetchOffices from "../hooks/useFetchOffices.tsx";

const OfficeOrdersOverviewPage = () => {
    const {setText} = useOutletContext<{ setText: (text: React.ReactNode) => void }>();

    useEffect(() => {
        setText(<h2>Перелік офісів комапнії<h5>Оберіть офіс для якого Ви хочете отримати перелік замовлень</h5></h2>);
    }, [setText]);

    const {id} = useParams<{ id: string }>();
    const {offices, loading, error} = useFetchOffices(id);

    if (loading) {
        return <CircularProgress/>;
    }

    if (error) return <ErrorMessage message={error}/>;

    if (!offices.length) {
        return (
            <NoExistCard
                title="Офісів не знайдено"
                message="Здається, у цієї компанії ще немає офісів.
                 Ви можете створити новий офіс за допомогою кнопки нижче та добавляти замовлення."
                buttonText="Створити офіс"
                buttonLink={`/office-create/${id}`}
            />
        );
    }


    return (
        <>
            <div style={{height: '500px'}}/>
            <Grid container spacing={6} justifyContent="center" sx={{padding: 4}}>
                {offices.map((office) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={office.id}>
                        <Card sx={{textAlign: "center", padding: 2, height: "100%"}}>
                            <CardContent>
                                <Typography variant="h5" sx={{marginBottom: 1}}>
                                    {office.city}, {office.country}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{marginBottom: 1}}>
                                    Адреса: {office.address}, {office.postal_code}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{marginBottom: 2}}>
                                    Телефон: {office.phone_number}
                                </Typography>
                                <Link to={`/order-list/${office.id}`}>
                                <Button
                                    variant="contained"
                                    // component={Link}
                                    to={`/orders/${office.id}`}
                                    sx={{marginTop: 2}}
                                >
                                    Переглянути замовлення
                                </Button></Link>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <div style={{height: '50px'}}/>
        </>
    );
};

export default OfficeOrdersOverviewPage;