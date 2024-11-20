import React, {useEffect} from 'react';
import BackgroundImage from "../components/BackgroundImage/BackgroundImage.tsx";
import Header from "../components/Header/Header.tsx";
import Footer from "../components/Footer/Footer.tsx";
import useUserType from "../hooks/useUserType";
import {useOutletContext} from "react-router-dom";
import {useDataCompanyOffice} from "../context/useDataCompanyOffice.tsx";
import {Grid, Paper, Typography, Box, Button} from '@mui/material';
import PageWrapper from "../components/MainPageComponents/PageWrapper.tsx";
import InfoBlocks from "../components/MainPageComponents/UI/InfoBlocks.tsx";

const MainPage = () => {
    const userType = useUserType();
    const ownerText = (
        <>
            Вітаємо у системі управління!
            <br/>
            Ви успішно увійшли як власник. Тепер ви маєте доступ до
            повного функціоналу для ефективного керування компанією:
            <br/>
            • Керуйте інформацією про Компанію та налаштовуйте дані про Офіси.
            <br/>
            • Контролюйте Комунальні послуги та оптимізуйте витрати.
            <br/>
            • Створюйте та обробляйте Замовлення, управляйте Провайдерами послуг.
            <br/>
            • Налаштовуйте свій Особистий акаунт для більш персоналізованого досвіду.
            <br/>
            Бажаємо продуктивної роботи з нашою платформою!
        </>
    );

    const managerText = (
        <>
            Вітаємо у системі управління!
            <br/>
            Ви успішно увійшли як менеджер. Тепер ви маєте доступ до
            основних функцій для підтримки роботи офісу:
            <br/>
            • Контролюйте Комунальні послуги та оптимізуйте витрати.
            <br/>
            • Створюйте та обробляйте Замовлення, управляйте Провайдерами послуг.
            <br/>
            • Налаштовуйте свій Особистий акаунт для більш персоналізованого досвіду.
            <br/>
            Бажаємо продуктивної роботи з нашою платформою!
        </>
    );

    const {setText} = useOutletContext<{ setText: (text: React.ReactNode) => void }>();

    useEffect(() => {
        if (userType === '1') {
            setText(ownerText);
        } else if (userType === '2') {
            setText(managerText);
        } else {
            setText(<>Сталася помилка. Невідомий тип користувача.</>);
        }
    }, [userType, setText]);


    const {companies, offices, isManagerWithoutOffices, loading} =
        useDataCompanyOffice();

    if (loading) {
        return <p>Завантаження...</p>;
    }

    const blocksData = companies.length
        ? companies.map(company => ({
            title: company.name,
            content: (
                <>
                    <p><strong>Юридична назва:</strong> {company.legal_name}</p>
                    <p><strong>Опис:</strong> {company.description}</p>
                    <p><strong>Сайт:</strong> <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></p>
                    <p><strong>Дата створення:</strong> {new Date(company.created_at).toLocaleDateString()}</p>
                </>
            ),
        }))
        : offices.length
            ? offices.map(office => ({
                title: office.city,
                content: (
                    <>
                        <p><strong>Адреса:</strong> {office.address}</p>
                        <p><strong>Країна:</strong> {office.country}</p>
                        <p><strong>Поштовий індекс:</strong> {office.postal_code}</p>
                        <p><strong>Телефон:</strong> {office.phone_number}</p>
                    </>
                ),
            }))
            : null;


    return (
        <PageWrapper>
            <div style={{height: '500px'}}/>
            <InfoBlocks blocksData={blocksData}/>
        </PageWrapper>
    );
};

export default MainPage;