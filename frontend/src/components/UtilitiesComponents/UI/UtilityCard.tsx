import React from 'react';
import {Button, Link} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";

interface UtilityCardProps {
    utility: {
        id: number;
        utilities_type_display: string;
        utility_id: number;
        date: string;
        counter: number;
        price: number;
        office_display: string;
    }
}

const UtilityCard: React.FC<UtilityCardProps> = ({utility}) => {
    return (
        <div>
            <p><strong>Тип комунальної послуги:</strong> {utility.utilities_type_display}</p>
            <p><strong>Дата:</strong> {utility.date}</p>
            <p><strong>Показник:</strong> {utility.counter}</p>
            <p><strong>Сума оплати:</strong> {utility.price}</p>
            <p><strong>Офіс:</strong> {utility.office_display}</p>
            <Link to={`/utility/${utility.utility_id}`} component={RouterLink} style={{textDecoration: 'none'}}>
                <Button
                    variant="outlined"
                    sx={{
                        marginTop: '16px',
                        padding: '6px 16px',
                        fontSize: '0.875rem',
                        borderRadius: '4px',
                        borderColor: '#000',
                        color: '#000',
                        '&:hover': {
                            borderColor: '#333',
                            backgroundColor: '#f5f5f5',
                        },
                    }}
                >
                    Переглянути сторінку
                </Button>
            </Link>
        </div>
    );
};

export default UtilityCard;