import React, {useState} from 'react';
import './styles/App.css';
import {Outlet} from 'react-router-dom';
import Footer from './components/Footer/Footer.tsx';
import BackgroundImage from './components/BackgroundImage/BackgroundImage.tsx';
import Header from './components/Header/Header.tsx';
import {DataProvider} from './context/useDataCompanyOffice.tsx';

const App = () => {
    const [text, setText] = useState<React.ReactNode>(<></>);

    return (
        <DataProvider>
            <div>
                <BackgroundImage text={text}/>
                <Header/>
                <Outlet context={{setText}}/>
                <Footer/>
            </div>
        </DataProvider>
    );
};

export default App;
