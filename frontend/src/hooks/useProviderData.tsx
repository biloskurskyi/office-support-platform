import { useState, useEffect } from "react";
import axios from "axios";

const useProviderData = (id) => {
    const [provider, setProvider] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone_number: '',
        email: '',
        company: '',
        company_id: '',
        bank_details: '',
    });
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const response = await axios.get(`http://localhost:8765/api/provider/${id}/`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
                });
                setProvider(response.data);
                setFormData({
                    name: response.data.name,
                    address: response.data.address,
                    phone_number: response.data.phone_number,
                    email: response.data.email,
                    company: response.data.company,
                    company_id: response.data.company_id,
                    bank_details: response.data.bank_details,
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching company data:', error);
                setErrorMessage('Помилка завантаження даних компанії.');
                setLoading(false);
            }
        };

        fetchCompanyData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8765/api/provider/${id}/`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
            });
            setSuccessMessage('Дані компанії оновлено успішно');
            setErrorMessage('');
        } catch (err) {
            setErrorMessage('Помилка оновлення даних.');
            setSuccessMessage('');
        }
    };

    return { provider, formData, setFormData, loading, successMessage, errorMessage, handleSubmit };
};

export default useProviderData;
