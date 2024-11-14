import React from 'react';
import BackgroundImage from "../components/BackgroundImage/BackgroundImage";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import UserForm from "../components/UserForm/UserForm";  // імпортуємо нашу форму

const UserPage = () => {
    return (
        <div style={{ position: 'relative' }}>
            <BackgroundImage text={<><h1>Особиста сторінка</h1></>} />
            <Header />
            <div style={{ height: '500px' }} />
            <UserForm /> {/* Додаємо форму */}
            <div style={{ height: '50px' }} />
            <Footer />
        </div>
    );
};

export default UserPage;
