import React from 'react';
import {Box, Button, Grid, Typography} from '@mui/material';
import CustomTextField from "../UserForm/UI/CustomTextField.tsx";
import FormPaper from "../RegisterForm/UI/FormPaper.tsx";
import UpdateButton from "../UserForm/UI/UpdateButton.tsx";
import {Link} from "react-router-dom";

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
                        <CustomTextField
                            label="Файл *"
                            value={formData.file}
                            name="file"
                            disabled
                        />
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

                <Link to={`/order-list/${order.office_id}`} style={{textDecoration: "none", color: "inherit"}}>
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
