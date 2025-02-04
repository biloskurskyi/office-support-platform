import React, {useState} from 'react';
import axios from 'axios';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Snackbar} from '@mui/material';
import {useNavigate} from 'react-router-dom';

const UseDeleteOrder = ({orderId}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Відкриття/закриття діалогу
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Виконання запиту на видалення
    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await axios.delete(
                `http://localhost:8765/api/order/${orderId}/`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    },
                }
            );
            setSuccessMessage('Замовлення успішно видалено!');
            setErrorMessage('');
            setLoading(false);
            setOpen(false);
            // Перехід на іншу сторінку, наприклад, на список замовлень
            navigate('/main');
        } catch (error) {
            setLoading(false);
            if (error.response) {
                setErrorMessage(error.response.data.detail || 'Помилка при видаленні');
            } else {
                setErrorMessage('Не вдалося з\'єднатися з сервером');
            }
        }
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '30px',
                }}
            >
                <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={handleClickOpen}
                    sx={{
                        backgroundColor: '#e74c3c',
                        color: '#fff',
                        fontWeight: 'bold',
                        '&:hover': {backgroundColor: '#c0392b'},
                    }}
                >
                    Видалити замовлення
                </Button>
            </Box>

            {/* Діалогове вікно для підтвердження видалення */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Підтвердження видалення</DialogTitle>
                <DialogContent>
                    <p>Ви впевнені, що хочете видалити це замовлення?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Скасувати
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        disabled={loading}
                    >
                        {loading ? 'Видалення...' : 'Видалити'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Відображення повідомлень для користувача */}
            <Snackbar
                open={!!successMessage}
                message={successMessage}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage('')}
            />
            <Snackbar
                open={!!errorMessage}
                message={errorMessage}
                autoHideDuration={6000}
                onClose={() => setErrorMessage('')}
            />
        </>
    );
};

export default UseDeleteOrder;