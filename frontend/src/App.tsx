import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer.tsx'
import './styles/App.css';
import BackgroundImage from "./components/BackgroundImage.tsx";

const App = () => {
    return (
        <div style={{position: 'relative'}}>
            <BackgroundImage/>
            <Header/>
            <div style={{height: '900px'}}>
            </div>
            <Footer/>
        </div>
    );
}

export default App;

