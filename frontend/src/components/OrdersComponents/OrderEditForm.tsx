import React, {useEffect, useState} from 'react';
import {
    Box,
    Typography,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Button
} from "@mui/material";
import CustomTextField from "../UserForm/UI/CustomTextField.tsx";
import FormPaper from "../RegisterForm/UI/FormPaper.tsx";
import UpdateButton from "../UserForm/UI/UpdateButton.tsx";
import {Link} from "react-router-dom";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import axios from "axios";

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

    const [currencies, setCurrencies] = useState<{ id: string; label: string }[]>([]);

    useEffect(() => {
        axios
            .get("http://localhost:8765/api/currencies/")
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setCurrencies(response.data);
                } else {
                    console.error("Unexpected response structure:", response.data);
                }
            })
            .catch((error) =>
                console.error("Помилка завантаження валют:", error)
            );
    }, []);

    const handleFileDownload = () => {
        const fileLink = document.createElement('a');
        fileLink.href = formData.file;
        fileLink.download = formData.file.split('/').pop() || 'file.pdf';
        fileLink.click();
    };

    if (!order) {
        return (
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", padding: "10px"}}>
                <Typography color="error.main" sx={{marginTop: "10px"}}>
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
                        <Grid item xs={12}>
                            <FormControl fullWidth sx={{
                                marginTop: '10px',
                                marginBottom: '10px',
                                '.MuiInputLabel-root': {
                                    backgroundColor: '#fff',
                                    padding: '0 5px',
                                    transform: 'translate(14px, -6px) scale(0.75)',
                                },
                                '.MuiSelect-select': {
                                    padding: '16px',
                                },
                            }}>
                                <InputLabel id="currency-select-label" sx={{
                                    fontSize: '16px',
                                    fontWeight: '500',
                                }}>
                                    Валюта *
                                </InputLabel>
                                <Select
                                    labelId="currency-select-label"
                                    id="currency-select"
                                    value={formData.currency}
                                    name="currency"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            currency: e.target.value,
                                        })
                                    }
                                    displayEmpty
                                    sx={{borderRadius: "8px"}}
                                >
                                    <MenuItem value="">
                                        <em>Не вибрано</em>
                                    </MenuItem>
                                    {currencies.map((currency) => (
                                        <MenuItem
                                            key={currency.id}
                                            value={currency.id}
                                        >
                                            {currency.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

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
