import React, {useEffect} from 'react';
import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import {Button, Card, CardContent, CircularProgress, Grid, Link, Typography} from "@mui/material";
import ErrorMessage from "../components/OfficesListOwnerComponent/UI/ErrorMessage.tsx";
import useFetchUtilityTypes from "../hooks/useFetchUtilityTypes.tsx";


const UtilityTypeListPage = () => {

    const {setText} = useOutletContext<{ setText: (text: React.ReactNode) => void }>();

    useEffect(() => {
        setText(<h2>Перелік видів комунальних послуг для офісу</h2>);
    }, [setText]);
    const navigate = useNavigate();

    const {id} = useParams<{ id: string }>();
    const {utility, loading, error} = useFetchUtilityTypes(id);

    if (loading) {
        return <CircularProgress/>;
    }

    if (error) return <ErrorMessage message={error}/>;

    return (
        <>
            <div style={{height: '500px'}}/>
            <Grid container spacing={4} justifyContent="center" sx={{padding: 4}}>
                {utility.map((item) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                        <Card sx={{
                            backgroundColor: '#fff',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            borderRadius: 4,
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            },
                        }}>
                            <CardContent sx={{textAlign: "center", padding: 4}}>
                                <Typography variant="h5" sx={{
                                    fontWeight: 600,
                                    color: '#333',
                                    marginBottom: 2,
                                    textTransform: 'uppercase',
                                }}>
                                    {item.utilities_type}
                                </Typography>

                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#1976d2',
                                        color: '#fff',
                                        '&:hover': {
                                            backgroundColor: '#1565c0',
                                        },
                                    }}
                                    onClick={() => navigate(`/utility-for-office-by-type/${id}/${item.id}`)}
                                >
                                    Переглянути
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <div style={{height: '50px'}}/>
        </>
    );
};

export default UtilityTypeListPage;