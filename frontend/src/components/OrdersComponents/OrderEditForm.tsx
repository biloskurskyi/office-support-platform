import React from 'react';
import {Box, Button, Grid, Typography} from '@mui/material';
import CustomTextField from "../UserForm/UI/CustomTextField.tsx";
import FormPaper from "../RegisterForm/UI/FormPaper.tsx";
import UpdateButton from "../UserForm/UI/UpdateButton.tsx";
import {Link} from "react-router-dom";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

interface OrderEditFormProps {
    formData: {
        title: string;
        description: string;
        deal_value: string;
        currency: string;
        file: string;
        provider_name: string;
        office_phone_number: string;
    };
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    handleSubmit: (e: React.FormEvent) => void;
    errorMessage: string;
    successMessage: string;
    order: any;
}

const OrderEditForm: React.FC<OrderEditFormProps> = ({
                                                         formData,
                                                         setFormData,
                                                         handleSubmit,
                                                         errorMessage,
                                                         successMessage,
                                                         order,
                                                     }) => {

    const handleFileDownload = () => {
        const fileLink = document.createElement('a');
        fileLink.href = formData.file;
        fileLink.download = formData.file.split('/').pop() || 'file.pdf';
        fileLink.click();
    };

    if (!order) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}>
                <Typography color="error.main" sx={{ marginTop: "10px" }}>
                    Невідоме замовлення або виникла помилка завантаження даних. Будь ласка, спробуйте пізніше.
                </Typography>
            </Box>
        );
    }


    return (
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", padding: "10px"}}>
            <FormPaper title="Оновити дані">
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <CustomTextField
                            label="Назва замовлення *"
                            value={formData.title}
                            name="title"
                            onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                        />
                        <CustomTextField
                            label="Опис"
                            value={formData.description}
                            name="description"
                            onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                        />
                        <CustomTextField
                            label="Вартість угоди *"
                            value={formData.deal_value}
                            name="deal_value"
                            onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                        />
                        <CustomTextField
                            label="Валюта *"
                            value={formData.currency}
                            name="currency"
                            onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                        />
                        {/* Поля, які не можна редагувати */}
                        {/* Поле файлу - не редагується, але файл можна завантажити */}
                        <Grid item xs={12} sx={{display: 'flex', alignItems: 'center'}}>
                            Звіт *:
                            <Button
                                startIcon={<PictureAsPdfIcon/>}
                                onClick={handleFileDownload}
                                sx={{
                                    marginLeft: 2,
                                    color: '#d32f2f',
                                    textTransform: 'none',
                                }}
                            >
                                Завантажити файл
                            </Button>
                        </Grid>

                        <CustomTextField
                            label="Назва постачальника *"
                            value={formData.provider_name}
                            name="provider_name"
                            disabled
                        />
                        <CustomTextField
                            label="Номер телефону офісу *"
                            value={formData.office_phone_number}
                            name="office_phone_number"
                            disabled
                        />
                    </Grid>

                    {successMessage && (
                        <Typography color="success.main" sx={{marginTop: "10px"}}>
                            {successMessage}
                        </Typography>
                    )}
                    {errorMessage && (
                        <Typography color="error.main" sx={{marginTop: "10px"}}>
                            {errorMessage}
                        </Typography>
                    )}

                    <UpdateButton/>
                </form>

                <hr/>

                <Link to={`/order-list/${order.office_id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <Box sx={{display: "flex", justifyContent: "center", marginTop: "30px"}}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            sx={{
                                backgroundColor: "#58d68d",
                                color: "#fff",
                                fontWeight: "bold",
                                "&:hover": {
                                    backgroundColor: "#1d8348",
                                },
                            }}
                        >
                            Перелік Замовлень для офісу
                        </Button>
                    </Box>
                </Link>

            </FormPaper>
        </Box>
    );
};

export default OrderEditForm;
