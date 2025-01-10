import React, { useEffect } from 'react';
import BackgroundImage from '../components/BackgroundImage/BackgroundImage';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import UserForm from '../components/UserForm/UserForm'; // імпортуємо нашу форму
import { useOutletContext } from 'react-router-dom';

const UserPage = () => {
  const { setText } = useOutletContext<{
    setText: (text: React.ReactNode) => void;
  }>();

  useEffect(() => {
    setText(<h1>Особиста сторінка</h1>);
  }, [setText]);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ height: '500px' }} />
      <UserForm /> {/* Додаємо форму */}
      <div style={{ height: '50px' }} />
    </div>
  );
};

export default UserPage;
