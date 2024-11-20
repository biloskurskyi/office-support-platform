import React from 'react';
import {Grid, Paper, Typography, Box, Button} from '@mui/material';

interface Block {
    title: string;
    content: string;
}

interface InfoBlocksProps {
    blocksData: Block[] | null;
}

const InfoBlocks: React.FC<InfoBlocksProps> = ({blocksData}) => {
    if (!blocksData) {
        return (
            <Typography
                variant="h6"
                sx={{marginTop: '20px', textAlign: 'center', color: '#555'}}
            >
                Інформація про компанії або офіси наразі відсутня. <br/>
                Почніть свій шлях до ефективного управління — створіть компанію прямо зараз! <br/>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        marginTop: '15px',
                        padding: '10px 20px',
                        fontSize: '1rem',
                        borderRadius: '20px',
                        marginBottom: '100px',
                        backgroundColor: '#4867d8',
                        '&:hover': {
                            backgroundColor: '#1d3caf',
                        },
                    }}
                >
                    Створити компанію
                </Button>
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                padding: '0 10px',
                marginBottom: '100px',
                display: 'flex',
                justifyContent: blocksData.length === 1 ? 'center' : 'flex-start',
                alignItems: blocksData.length === 1 ? 'center' : 'flex-start',

            }}
        >
            <Grid container spacing={2} justifyContent={blocksData.length === 1 ? 'center' : 'flex-start'}>
                {blocksData.map((block, index) => (
                    <Grid item xs={12} sm={6} key={index}>
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
                                {block.title}
                            </Typography>
                            <Typography>{block.content}</Typography>
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
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default InfoBlocks;
