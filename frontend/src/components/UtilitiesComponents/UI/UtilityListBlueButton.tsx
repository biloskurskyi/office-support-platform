import React from 'react';
import {Link} from "react-router-dom";
import {Button} from "@mui/material";

interface UtilityListButtonProps {
    id: string;
}

const UtilityListBlueButton: React.FC<UtilityListButtonProps> = ({id}) => {
    return (
        <Link
            to={`/utility-type-list/${id}`}
            style={{textDecoration: 'none', color: 'inherit'}}
        >
            <Button
                variant="contained"
                sx={{
                    backgroundColor: '#1976d2',
                    color: '#ffffff',
                    padding: '10px 20px',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                        backgroundColor: '#155a9c',
                    },
                }}
            >
                Перелік комунальних послуг
            </Button>
        </Link>
    );
};

export default UtilityListBlueButton;