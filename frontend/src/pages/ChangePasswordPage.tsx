import React, { useEffect } from 'react';
import BackgroundImage from '../components/BackgroundImage/BackgroundImage';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ChangePasswordForm from '../components/ChangePassword/ChangePasswordForm.tsx';
import { useOutletContext } from 'react-router-dom'; // імпортуємо нашу форму

const ChangePasswordPage = () => {
  const { setText } = useOutletContext<{
    setText: (text: React.ReactNode) => void;
  }>();

  useEffect(() => {
    setText(<h2>Зміна паролю користувача</h2>);
  }, [setText]);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ height: '500px' }} />
      <ChangePasswordForm />
      <div style={{ height: '50px' }} />
    </div>
  );
};

export default ChangePasswordPage;
