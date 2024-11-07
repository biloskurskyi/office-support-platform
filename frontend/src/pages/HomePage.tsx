import React from 'react';
import Header from '../components/Header/Header.tsx';
import Footer from '../components/Footer/Footer.tsx';
import BackgroundImage from '../components/BackgroundImage/BackgroundImage.tsx';
import InfoBlocks from '../components/InfoBlocks/InfoBlocks.tsx';

const HomePage = () => {
    return (
        <div style={{position: 'relative'}}>
            <BackgroundImage/>
            <Header/>
            <div style={{height: '500px'}}>
            </div>
            <InfoBlocks/>
            <Footer/>
        </div>
    );
};

export default HomePage;
