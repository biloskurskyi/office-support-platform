import React from 'react';
import BackgroundImage from "../components/BackgroundImage/BackgroundImage.tsx";
import Header from "../components/Header/Header.tsx";
import LoginForm from "../components/LoginForm/LoginForm.tsx";
import Footer from "../components/Footer/Footer.tsx";
import ActivateUser from "../components/ActivateUser/ActivateUser.tsx";
import {Link} from "react-router-dom";
import {Box, Button} from "@mui/material";

const ActivateUserPage = () => {
    return (
        <div>
            <div style={{position: 'relative'}}>
                <BackgroundImage text={
                    <>
                        <ActivateUser/>
                    </>
                }/>
                <Header/>
                <div style={{height: '480px'}}>
                </div>
                <Link to="/Login" style={{textDecoration: 'none'}}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{
                                textTransform: 'none',
                                fontSize: '1.5rem',
                                padding: '15px 30px',
                                textDecoration: 'none',
                                backgroundColor: '#596177',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#454d66',
                                },
                            }}
                        >
                            Увійти
                        </Button>
                    </Box>
                </Link>
                <div style={{height: '50px'}}/>
                <Footer/>
            </div>
        </div>
    );
};

export default ActivateUserPage;