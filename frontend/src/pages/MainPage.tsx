import React from 'react';
import BackgroundImage from "../components/BackgroundImage/BackgroundImage.tsx";
import Header from "../components/Header/Header.tsx";
import Footer from "../components/Footer/Footer.tsx";

const MainPage = () => {
    return (
        <div style={{position: 'relative'}}>
            <BackgroundImage text={
                <>
                    Вітаємо у системі управління!
                    <br/>
                    Ви успішно увійшли як власник/менеджер. Тепер ви маєте доступ до
                    повного функціоналу для ефективного керування компанією/офісом:
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
            }/>
            <Header/>
            <div style={{height: '500px'}}>
            </div>
            <Footer/>
        </div>
    );
};

export default MainPage;