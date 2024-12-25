import React from 'react';
import {Link} from "react-router-dom";
import {Box, Button} from "@mui/material";

interface UtilityListButtonProps {
    id: string;
}


const UtilityListButton: React.FC<UtilityListButtonProps> = ({id}) => {
    return (
        <Link to={`/utility-type-list/${id}`} style={{textDecoration: 'none', color: 'inherit'}}>
            <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '30px'}}>
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
                        },
                    }}
                >
                    Перелік комунальних послуг
                </Button>
            </Box>
        </Link>
    );
};

export default UtilityListButton;