import React from 'react';
import {Paper, Typography, Button} from '@mui/material';

interface InfoBlockProps {
    title: string;
    content: React.ReactNode;
}

const InfoBlock: React.FC<InfoBlockProps> = ({title, content}) => {
    return (
        <Paper
            elevation={3}
            sx={{
                padding: 2,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                height: '100%',
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    borderBottom: '2px solid #ccc',
                    paddingBottom: '8px',
                    marginBottom: '12px',
                }}
            >
                {title}
            </Typography>
            <Typography>{content}</Typography>
            <Typography>
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
            </Typography>
        </Paper>
    );
};

export default InfoBlock;
