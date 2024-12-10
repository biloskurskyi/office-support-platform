import React, {useEffect} from 'react';
import {useOutletContext, useParams} from "react-router-dom";
import useProviderData from "../hooks/useProviderData.tsx";
import ProviderEditForm from "../components/ProviderComponents/ProviderEditForm.tsx";

const ProviderEditPage = () => {
    const {setText} = useOutletContext<{ setText: (text: React.ReactNode) => void }>();

    useEffect(() => {

        setText(<h2>Налаштування постачальника</h2>);
    }, [setText]);

    const {id} = useParams();

    const {provider, formData, setFormData, loading, successMessage, errorMessage, handleSubmit} = useProviderData(id);

    useEffect(() => {
        setText(<h2>Налаштування постачальника</h2>);
    }, [setText]);

    if (loading) return <div>Завантаження...</div>;


    return (
        <div>
            <div style={{height: "500px"}}/>

            <ProviderEditForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                successMessage={successMessage}
                errorMessage={errorMessage}
                provider={provider}
            />

            <div style={{height: "50px"}}/>
        </div>
    );
};

export default ProviderEditPage;