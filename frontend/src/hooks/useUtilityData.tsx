import React, {useEffect, useState} from 'react';
import axios from "axios";

const UseUtilityData = (id) => {
    const [utility, setUtility] = useState(null);
    const [formData, setFormData] = useState({
        utilities_type_display: '',
        date: '',
        counter: '',
        price: '',
        office_display: '',
        office_id: '',
        utility_type_id: '',
    });
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const response = await axios.get(`http://localhost:8765/api/utility/${id}/`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
                });
                setUtility(response.data);
                setFormData({
                    utilities_type_display: response.data.utilities_type_display,
                    date: response.data.date,
                    counter: response.data.counter,
                    price: response.data.price,
                    office_display: response.data.office_display,
                    office_id: response.data.office_id,
                    utility_type_id: response.data.utility_type_id
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching company data:', error);
                setErrorMessage('Помилка завантаження даних комунальних послуг.');
                setLoading(false);
            }
        };

        fetchCompanyData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8765/api/utility/${id}/`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
            });
            setSuccessMessage('Дані про комунальну послугу оновлено успішно');
            setErrorMessage('');
        } catch (err) {
            setErrorMessage('Помилка оновлення даних.');
            setSuccessMessage('');
        }
    };

    return { utility, formData, setFormData, loading, successMessage, errorMessage, handleSubmit };
};


export default UseUtilityData;