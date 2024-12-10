import React from 'react';
import {Grid, Typography, Box} from '@mui/material';
import TextFieldWithLabel from "../RegisterForm/UI/TextFieldWithLabel.tsx";
import SubmitButton from "../RegisterForm/UI/SubmitButton.tsx";
import ProviderListButton from "./UI/ProviderListButton.tsx";
import {useParams} from "react-router-dom";

interface ProviderFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    errorMessage: string | null;
}

const ProviderForm: React.FC<ProviderFormProps> = ({
                                                       formData,
                                                       handleInputChange,
                                                       handleSubmit,
                                                       errorMessage,
                                                   }) => {
    const {id} = useParams<{ id: string }>();
    return (
        <>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <TextFieldWithLabel
                        label="Ім'я постачальника *"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    <TextFieldWithLabel
                        label="Електрона адреса *"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <TextFieldWithLabel
                        label="Адреса *"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                    />
                    <TextFieldWithLabel
                        label="Номер телефону"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                    />
                    <TextFieldWithLabel
                        label="Банківські реквізити"
                        name="bank_details"
                        value={formData.bank_details}
                        onChange={handleInputChange}
                    />
                </Grid>

                {errorMessage && (
                    <Typography color="error" sx={{marginTop: '10px'}}>
                        {errorMessage}
                    </Typography>
                )}

                <ul>
                    <Typography variant="h6" gutterBottom>
                        Правила створення постачальника:
                    </Typography>
                    <li>В одній компанії постачальник має мати унікальний номер телефону або електронну адресу.</li>
                    <li>Банківські реквізити не можуть повторюватися.</li>
                    <li>
                        Поле "Електронна адреса" або "Номер телефону" може бути пустим, але щонайменше одне з них
                        обов'язково
                        має бути заповнене.
                    </li>
                </ul>

                <SubmitButton text="Створити постачальника" onSubmit={handleSubmit}/>
                <div style={{height: '15px'}}/>
                <hr/>
                <ProviderListButton id={id}/>
            </form>
        </>
    );
};

export default ProviderForm;
