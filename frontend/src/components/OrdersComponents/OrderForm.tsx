import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import TextFieldWithLabel from "../RegisterForm/UI/TextFieldWithLabel.tsx";
import SubmitButton from "../RegisterForm/UI/SubmitButton.tsx";
import ProviderListButton from "../ProviderComponents/UI/ProviderListButton.tsx";
import OrderListButton from "./UI/OrderListButton.tsx";
import useFetchManagers from "../../hooks/useFetchManagers.tsx";
import useProviders from "../../hooks/useProviders.tsx";
import UseProvidersByOffice from "../../hooks/useProvidersByOffice.tsx";
import axios from "axios";


interface OrderFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    errorMessage: string | null;
}

const OrderForm: React.FC<OrderFormProps> = ({
                                                 formData,
                                                 handleInputChange,
                                                 handleSubmit,
                                                 errorMessage,
                                             }) => {
    const {id} = useParams<{ id }>();

    const {providers, loading, error} = UseProvidersByOffice(id);

    const [uploadedFile, setUploadedFile] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setUploadedFile(file.name);
            handleInputChange({
                target: {name: "file", value: file},
            } as React.ChangeEvent<HTMLInputElement>);
        }
    };

    const [currencies, setCurrencies] = useState([]);


    useEffect(() => {
        axios.get("http://localhost:8765/api/currencies/")
            .then((response) => {
                // Log response to inspect its structure
                console.log(response.data);
                // Ensure the response is an array
                if (Array.isArray(response.data)) {
                    setCurrencies(response.data);
                } else {
                    console.error("Unexpected response structure:", response.data);
                }
            })
            .catch((error) => console.error("Помилка завантаження валют:", error));
    }, []);


    return (
        <>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <TextFieldWithLabel
                        label="Назва замовлення *"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                    />
                    <TextFieldWithLabel
                        label="Опис"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                    <TextFieldWithLabel
                        label="Вартість угоди *"
                        name="deal_value"
                        value={formData.deal_value}
                        onChange={handleInputChange}
                    />
                    <Grid item xs={12}>
                    <FormControl
                        fullWidth
                        sx={{
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
                        }}
                    >
                        <InputLabel
                            id="currency-select-label"
                            sx={{
                                fontSize: '16px',
                                fontWeight: '500',
                            }}
                        >
                            Валюта *
                        </InputLabel>
                        <Select
                            labelId="currency-select-label"
                            id="currency-select"
                            value={formData.currency}
                            name="currency"
                            onChange={handleInputChange}
                            displayEmpty
                            sx={{
                                borderRadius: '8px',
                                border: '0px solid #ccc',
                                ':focus': {
                                    borderColor: '#1976d2',
                                },
                            }}
                        >
                            <MenuItem value="">
                                <em>Не вибрано</em>
                            </MenuItem>
                            {currencies.map((currency) => (
                                <MenuItem key={currency.id} value={currency.id}>
                                    {currency.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                            <Button
                                variant="contained"
                                component="label"
                                color="primary"
                                sx={{width: '100%', padding: '10px', borderRadius: '8px'}}
                            >
                                Завантажити звіт *
                                <input type="file" name="file" accept=".pdf" hidden onChange={handleFileChange}/>
                            </Button>
                            {uploadedFile && (
                                <Typography variant="subtitle1" color="textSecondary">
                                    Завантажено: {uploadedFile}
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl
                            fullWidth
                            sx={{
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
                            }}
                        >
                            <InputLabel
                                id="provider-select-label"
                                sx={{
                                    fontSize: '16px',
                                    fontWeight: '500',
                                }}
                            >
                                Постачальник замовлення *
                            </InputLabel>
                            <Select
                                labelId="provider-select-label"
                                id="provider-select"
                                value={formData.provider}
                                name="provider"
                                onChange={handleInputChange}
                                disabled={loading}
                                displayEmpty
                                sx={{
                                    borderRadius: '8px',
                                    border: '0px solid #ccc',
                                    ':focus': {
                                        borderColor: '#1976d2',
                                    },
                                }}
                            >
                                <MenuItem value="">
                                    <em>Не вибрано</em>
                                </MenuItem>
                                {providers.map((manager: { id: number; name: string; address: string }) => (
                                    <MenuItem
                                        key={manager.id}
                                        value={manager.id}
                                        sx={{
                                            whiteSpace: 'normal',
                                            wordBreak: 'break-word',
                                            lineHeight: '1.5',
                                        }}
                                    >
                                        Постачальник {manager.name} за адресою: {manager.address}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                </Grid>

                {errorMessage && (
                    <Typography color="error" sx={{marginTop: '10px'}}>
                        {errorMessage}
                    </Typography>
                )}

                <ul>
                    <Typography variant="h6" gutterBottom>
                        Правила створення замовлення:
                    </Typography>
                    <li>Замовлення для офісу повинно містити: унікальну назву, вартість угоди, валюту угоди, звіт з
                        підтвердженням угоди, назву постачальника який належить компанії.
                    </li>
                    <li>Якщо компанія не має власного постачальника, вона повина створити його та після того добавляти
                        замовлення.
                    </li>
                </ul>

                <SubmitButton text="Створити замовлення" onSubmit={handleSubmit}/>
                <div style={{height: '15px'}}/>
                <hr/>
                <OrderListButton id={id}/>
            </form>
        </>
    );
};

export default OrderForm;