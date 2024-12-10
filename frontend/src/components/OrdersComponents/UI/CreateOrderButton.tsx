import React from 'react';
import {Link} from "react-router-dom";
import {Button, CardActions} from "@mui/material";

interface Props {
    officeId: string | undefined;
}

const CreateOrderButton: React.FC<Props> = ({officeId}) => {
    return (
        <Link to={`/order-create/${officeId}`} style={{textDecoration: 'none', color: 'inherit'}}>
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
                    Створити замовлення
                </Button>
            </CardActions>
        </Link>
    );
};

export default CreateOrderButton;