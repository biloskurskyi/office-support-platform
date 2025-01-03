import React, {useEffect} from 'react';
import {useParams, useOutletContext, Link, useNavigate} from 'react-router-dom';
import {Button, Card, CardContent, CircularProgress, Grid, Typography} from "@mui/material";
import ErrorMessage from "../../components/OfficesListOwnerComponent/UI/ErrorMessage.tsx";
import NoExistCard from "../../components/NoExistCard/NoExistCard.tsx";
import useFetchOffices from "../../hooks/useFetchOffices.tsx";

type OfficeOverviewPageProps = {
    pageTitle: React.ReactNode;
    noExistTitle: string;
    noExistMessage: string;
    noExistButtonText: string;
    noExistButtonLink: (id: string) => string;
    cardButtonText: string;
    cardButtonLink: (id: string) => string;
    cardButtonColor?: string;
    cardButtonHoverColor?: string;
};

const OfficeOverviewPage: React.FC<OfficeOverviewPageProps> = ({
    pageTitle,
    noExistTitle,
    noExistMessage,
    noExistButtonText,
    noExistButtonLink,
    cardButtonText,
    cardButtonLink,
    cardButtonColor = '#1976d2',
    cardButtonHoverColor = '#1565c0',
}) => {
    const {setText} = useOutletContext<{ setText: (text: React.ReactNode) => void }>();

    useEffect(() => {
        setText(pageTitle);
    }, [setText, pageTitle]);

        const navigate = useNavigate();

    const user_type = localStorage.getItem("user_type")

    console.log("user_type" + user_type)
    if (user_type !== '1') {
        navigate("/error");
    }

    const {id} = useParams<{ id: string }>();
    const {offices, loading, error} = useFetchOffices(id);

    if (loading) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <CircularProgress/>
            </div>
        );
    }

    if (error) return <ErrorMessage message={error}/>;

    if (!offices.length) {
        return (
            <NoExistCard
                title={noExistTitle}
                message={noExistMessage}
                buttonText={noExistButtonText}
                buttonLink={noExistButtonLink(id!)}
            />
        );
    }

    return (
        <>
            <div style={{height: '470px'}}/>
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
                                <Link to={cardButtonLink(office.id)} style={{textDecoration: 'none'}}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            marginTop: 2,
                                            backgroundColor: cardButtonColor,
                                            '&:hover': {backgroundColor: cardButtonHoverColor},
                                        }}
                                    >
                                        {cardButtonText}
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <div style={{height: '50px'}}/>
        </>
    );
};

export default OfficeOverviewPage;
