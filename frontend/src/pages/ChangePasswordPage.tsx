import React from 'react';
import BackgroundImage from "../components/BackgroundImage/BackgroundImage";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import ChangePasswordForm from "../components/ChangePassword/ChangePasswordForm.tsx";  // імпортуємо нашу форму

const ChangePasswordPage = () => {
    return (
        <div style={{ position: 'relative' }}>
            <BackgroundImage text={<><h2>Зміна паролю користувача</h2></>} />
            {/*<Header />*/}
            <Header />
            <div style={{ height: '500px' }} />
            <ChangePasswordForm/>
            <div style={{ height: '50px' }} />
            <Footer />

        </div>
    );
};

export default ChangePasswordPage;
