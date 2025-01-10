import React from 'react';
import BackgroundImage from '../components/BackgroundImage/BackgroundImage.tsx';
import Header from '../components/Header/Header.tsx';
import Footer from '../components/Footer/Footer.tsx';
import LoginForm from '../components/LoginForm/LoginForm.tsx';

const LogInPage = () => {
  return (
    <div style={{ position: 'relative' }}>
      <BackgroundImage
        text={<>Введіть ваш емейл та пароль, щоб увійти до свого акаунту.</>}
      />
      <Header />
      <div style={{ height: '500px' }}></div>
      <LoginForm />
      <div style={{ height: '50px' }} />
      <Footer />
    </div>
  );
};

export default LogInPage;
