import React from 'react';
import Header from '../components/Header/Header.tsx';
import Footer from '../components/Footer/Footer.tsx';
import BackgroundImage from '../components/BackgroundImage/BackgroundImage.tsx';
import InfoBlocks from '../components/InfoBlocks/InfoBlocks.tsx';

const HomePage = () => {
    return (
        <div style={{position: 'relative'}}>
            <BackgroundImage text={
                <>
                    Вітаємо у системі для ефективного управління офісами! За допомогою нашої платформи ви можете:
                    <br/>
                    • Створювати та управляти офісами компанії.
                    <br/>
                    • Легко створювати замовлення для офісів.
                    <br/>
                    • Слідкувати за комунальними послугами і отримувати статистику витрат.
                    <br/>
                    Ваші офіси — в надійних руках!
                </>
            }/>
            <Header/>
            <div style={{height: '500px'}}>
            </div>
            <InfoBlocks/>
            <Footer/>
        </div>
    );
};

export default HomePage;
