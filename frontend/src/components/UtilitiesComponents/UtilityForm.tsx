import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Typography} from "@mui/material";
import TextFieldWithLabel from "../RegisterForm/UI/TextFieldWithLabel.tsx";
import SubmitButton from "../RegisterForm/UI/SubmitButton.tsx";
import ProviderListButton from "../ProviderComponents/UI/ProviderListButton.tsx";
import CustomTextField from "../UserForm/UI/CustomTextField.tsx";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import UtilityListButton from "./UI/UtilityListButton.tsx";
import axios from "axios";

interface UtilityFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    errorMessage: string | null;
}


const UtilityForm: React.FC<UtilityFormProps> = ({
                                                     formData,
                                                     handleInputChange,
                                                     handleSubmit,
                                                     errorMessage,
                                                 }) => {
    const {id} = useParams<{ id }>();

    const [utilities, setUtilities] = useState([]);


    useEffect(() => {
        const token = localStorage.getItem("jwtToken");

        axios.get(`http://localhost:8765/api/utilities/types/${id}/`, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then((response) => {
                console.log(response.data);
                if (Array.isArray(response.data)) {
                    setUtilities(response.data);
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
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Дата рефєстрації послуги *"
                                value={formData.date ? dayjs(formData.date) : null}
                                onChange={(newValue) => {
                                    handleInputChange({
                                        target: {
                                            name: 'date',
                                            value: newValue,
                                        },
                                    });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        sx={{
                                            minWidth: '100%',
                                            '& .MuiInputBase-root': {
                                                padding: '10px',
                                            },
                                        }}
                                    />
                                )}
                            />
                        </LocalizationProvider>
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
                                Вид комунальної послуги *
                            </InputLabel>
                            <Select
                                labelId="provider-select-label"
                                id="provider-select"
                                value={formData.utilities_type}
                                name="utilities_type"
                                onChange={handleInputChange}
                                // disabled={loading}
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
                                {utilities.map((manager: { id: number; utilities_type: string; }) => (
                                    <MenuItem
                                        key={manager.id}
                                        value={manager.id}
                                        sx={{
                                            whiteSpace: 'normal',
                                            wordBreak: 'break-word',
                                            lineHeight: '1.5',
                                        }}
                                    >
                                        {manager.utilities_type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormHelperText sx={{fontSize: '0.75rem', color: 'gray'}}>
                            * при виборі Збору відходів поле з показником лічильника власноруч збільшиться на 1
                        </FormHelperText>
                    </Grid>
                    <CustomTextField
                        label="Показники лічильника *"
                        value={formData.counter}
                        name="counter"
                        onChange={handleInputChange}
                        disabled={formData.utilities_type === 4}
                    />
                    <TextFieldWithLabel
                        label="Сума оплати *"
                        value={formData.price}
                        name="price"
                        onChange={handleInputChange}
                    />
                </Grid>

                {errorMessage && (
                    <Typography color="error" sx={{marginTop: "10px"}}>
                        {errorMessage}
                    </Typography>
                )}

                <ul>
                    <Typography variant="h6" gutterBottom>
                        Правила створення комунальної послуги:
                    </Typography>
                    <li>Обов’язково виберіть тип комунальної послуги</li>
                    <li>
                        Виберіть дату реєстрації. В один місяць не може бути зареєстровано більше ніж 1 унікальна
                        послуга певного типу для офісу.
                    </li>
                    <li>
                        Обов’язково заповніть показники лічильника (за винятком послуг збору відходів).
                    </li>
                    <li>
                        Показник лічильника не може бути меншим за показник попереднього місяця та більшим за
                        наступний!
                    </li>
                </ul>

                <SubmitButton text="Створити запис про комунальну послугу" onSubmit={handleSubmit}/>
                <div style={{height: "15px"}}/>
                <hr/>
                <UtilityListButton id={id}/>
            </form>
        </>
    );
};

export default UtilityForm;