import React, {useEffect} from 'react';
import {useOutletContext, useParams} from "react-router-dom";
import useOrderData from "../hooks/useOrderData.tsx";
import ProviderEditForm from "../components/ProviderComponents/ProviderEditForm.tsx";
import OrderEditForm from "../components/OrdersComponents/OrderEditForm.tsx";

const OrderEditPage = () => {
    const {setText} = useOutletContext<{ setText: (text: React.ReactNode) => void }>();

    useEffect(() => {

        setText(<h2>Редагування замовлення</h2>);
    }, [setText]);

    const {id} = useParams();

    const {order, formData, setFormData, loading, successMessage, errorMessage, handleSubmit}
        = useOrderData(id);

    useEffect(() => {
        setText(<h2>Налаштування постачальника</h2>);
    }, [setText]);

    if (loading) return <div>Завантаження...</div>;

    return (
        <div>
            <div style={{height: '500px'}}/>

            <OrderEditForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                errorMessage={errorMessage}
                successMessage={successMessage}
                order={order}
            />

            <div style={{height: '50px'}}/>
        </div>
    );
};

export default OrderEditPage;