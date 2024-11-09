import React from 'react';
import BackgroundImage from "../components/BackgroundImage/BackgroundImage.tsx";
import Header from "../components/Header/Header.tsx";
import Footer from "../components/Footer/Footer.tsx";
import RegisterForm from "../components/RegisterForm/RegisterForm.tsx";

const SignUpPage = () => {
    return (
        <div style={{position: 'relative'}}>
            <BackgroundImage text={
                <>
                    <p>
                        Зареєструйтесь для доступу до усіх можливостей платформи!
                        <br/>
                        Для реєстрації потрібно ввести унікальний емейл, створити надійний пароль та підтвердити свій
                        акаунт
                        через електронну пошту. Після цього ви зможете повноцінно користуватися всіма функціями системи.
                    </p>
                </>
            }/>
            <Header/>
            <div style={{height: '450px'}}/>
            <RegisterForm/>
             <div style={{height: '50px'}}/>
            <Footer/>
        </div>
    );
};

export default SignUpPage;