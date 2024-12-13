import React, {useEffect, useState} from 'react';
import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import axios from "axios";
import {Box} from "@mui/material";
import FormPaper from "../components/RegisterForm/UI/FormPaper.tsx";
import OrderForm from "../components/OrdersComponents/OrderForm.tsx";

const OrderCreatePage = () => {
    const {setText} = useOutletContext<{ setText: (text: React.ReactNode) => void }>();
    const {id} = useParams<{ id: string }>();

    useEffect(() => {
        setText(<h2>Створити постачальника компанії</h2>);
    }, [setText]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deal_value: '',
        currency: 0,
        file: null as File | null,
        provider: '',
        office_id: id || '',
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, files} = e.target;

        setFormData({
            ...formData,
            [name]: files && files.length > 0 ? files[0] : name === "currency" ? Number(value) : value,
        });
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log(!formData.title || !formData.provider || !formData.deal_value || !formData.currency || !formData.file)
        console.log(formData)
        if (!formData.title || !formData.provider || !formData.deal_value || !formData.currency || !formData.file) {
            setErrorMessage('Будь ласка, заповніть усі поля');
            return;
        }

        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("deal_value", formData.deal_value);
        data.append("currency", formData.currency);
        data.append("provider", formData.provider);
        data.append("office_id", formData.office_id);
        if (formData.file) {
            data.append("file", formData.file);
        }

        try {
            await axios.post(`http://localhost:8765/api/order/`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            });
            navigate(`/order-list/${id}`);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setErrorMessage(error.response.data.detail || "Некоректно введені дані!");
            } else {
                setErrorMessage("Не вдалося з'єднатися з сервером");
            }
        }
    };


    return (
        <>
            <div style={{height: '500px'}}/>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                }}
            >
                <FormPaper title="Створення замовлення">
                    <OrderForm
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        errorMessage={errorMessage}
                    />
                </FormPaper>
            </Box>
            <div style={{height: '50px'}}/>
        </>
    );
};

export default OrderCreatePage;