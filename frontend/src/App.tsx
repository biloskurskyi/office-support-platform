import React from 'react';
import './styles/App.css';
import HomePage from "./pages/HomePage.tsx";
import {Outlet} from "react-router-dom";

const App = () => {
    return (
        <div>
            <Outlet/>
        </div>
    );
}

export default App;

