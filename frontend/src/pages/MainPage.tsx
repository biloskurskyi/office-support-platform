import React, {useEffect} from 'react';
import BackgroundImage from "../components/BackgroundImage/BackgroundImage.tsx";
import Header from "../components/Header/Header.tsx";
import Footer from "../components/Footer/Footer.tsx";
import useUserType from "../hooks/useUserType";
import {useOutletContext} from "react-router-dom";

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

    const { setText } = useOutletContext<{ setText: (text: React.ReactNode) => void }>();

    useEffect(() => {
        if (userType === '1') {
            setText(ownerText);
        } else if (userType === '2') {
            setText(managerText);
        } else {
            setText(<>Сталася помилка. Невідомий тип користувача.</>);
        }
    }, [userType, setText, ownerText, managerText]);

    return (
        <div style={{position: 'relative'}}>
            <div style={{height: '500px'}}>
            </div>
        </div>
    );
};

export default MainPage;