import React, {useEffect} from 'react';
import {useOutletContext} from "react-router-dom";

const OrderEditPage = () => {
    const {setText} = useOutletContext<{ setText: (text: React.ReactNode) => void }>();

    useEffect(() => {

        setText(<h2>Редагування замовлення</h2>);
    }, [setText]);

    return (
        <div>
            <div style={{height: '500px'}}/>

            <div style={{height: '50px'}}/>
        </div>
    );
};

export default OrderEditPage;