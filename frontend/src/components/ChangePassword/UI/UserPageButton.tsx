import React from 'react';
import {Link} from "react-router-dom";
import {Box, Button} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";

const UserPageButton = () => {
    return (
        <Link to="/user" style={{textDecoration: 'none', color: 'inherit'}}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '30px',
            }}>
                <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                        backgroundColor: '#0dde38', // Зелений фон
                        color: '#fff', // Білий текст
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: '#0bbe30', // Трохи темніший зелений на hover
                        }
                    }}
                >
                    Профіль<AccountCircle/>
                </Button>
            </Box>
        </Link>
    );
};

export default UserPageButton;