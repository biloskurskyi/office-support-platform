import React from 'react';
import {useParams} from "react-router-dom";
import {Grid, Typography} from "@mui/material";
import TextFieldWithLabel from "../RegisterForm/UI/TextFieldWithLabel.tsx";
import SubmitButton from "../RegisterForm/UI/SubmitButton.tsx";
import ProviderListButton from "../ProviderComponents/UI/ProviderListButton.tsx";
import OrderListButton from "./UI/OrderListButton.tsx";


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
    const {id} = useParams<{ id: string }>();
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
                    <TextFieldWithLabel
                        label="Валюта *"
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                    />
                    <TextFieldWithLabel
                        label="Звіт *"
                        name="file"
                        value={formData.file}
                        onChange={handleInputChange}
                    />
                    <TextFieldWithLabel
                        label="Постачальник замовлення *"
                        name="provider"
                        value={formData.provider}
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
                        Правила створення замовлення:
                    </Typography>
                    <li>Замовлення для офісу повинно містити: унікальну назву, вартість угоди, валюту угоди, звіт з підтвердженням угоди, назву постачальника який належить компанії.</li>
                    <li>Якщо компанія не має власного постачальника, вона повина створити його та після того добавляти замовлення.</li>
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