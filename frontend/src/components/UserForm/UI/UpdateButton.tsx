import React from 'react';
import {Box, Button} from "@mui/material";

const UpdateButton = () => {
    return (
        <Box sx={{marginTop: '20px'}}>
            <Button variant="contained" color="primary" fullWidth type="submit">
                Оновити дані
            </Button>
        </Box>
    );
};

export default UpdateButton;