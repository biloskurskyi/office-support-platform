import React from 'react';
import BackgroundImage from "../components/BackgroundImage/BackgroundImage.tsx";
import Header from "../components/Header/Header.tsx";
import Footer from "../components/Footer/Footer.tsx";
import useUserType from "../hooks/useUserType";

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

    return (
        <div style={{position: 'relative'}}>
            <BackgroundImage text={
                userType === '1' ? ownerText :
                    userType === '2' ? managerText :
                        <>error</>
            }/>
            <Header/>
            <div style={{height: '500px'}}>
            </div>
            <Footer/>
        </div>
    );
};

export default MainPage;