import React, {useEffect} from 'react';
import {useOutletContext, useParams} from "react-router-dom";
import UseUtilityData from "../hooks/useUtilityData.tsx";
import UtilityEditForm from "../components/UtilitiesComponents/UtilityEditForm.tsx";

const UtilityEditPage = () => {
    const { setText } = useOutletContext<{ setText: (text: React.ReactNode) => void }>();
    const { id } = useParams();
    const { utility, formData, setFormData, loading, successMessage, errorMessage, handleSubmit } = UseUtilityData(id);

    useEffect(() => {
        setText(<h2>Налаштування інформації про комунальні послуги</h2>);
    }, [setText]);

    if (loading) return <div>Завантаження...</div>;

    return (
        <div>
            <div style={{ height: '500px' }} />
            <UtilityEditForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                successMessage={successMessage}
                errorMessage={errorMessage}
                utility={utility}
            />
            <div style={{ height: '50px' }} />
        </div>
    );
};

export default UtilityEditPage;