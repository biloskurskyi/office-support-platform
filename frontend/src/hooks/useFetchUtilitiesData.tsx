import React, {useEffect, useState} from 'react';
import axios, {AxiosResponse} from "axios";

export interface Utility {
    id: number;
    utilities_type: number;
    date: string;
    counter: number;
    price: number;
    office: number;
}


const UseFetchUtilitiesData = (officeId: string | undefined, utilityId: string | undefined) => {
    const [utilities, setUtilities] = useState<Utility[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                const userType = localStorage.getItem("user_type");

                if (!token) {
                    setError("Необхідно авторизуватися.");
                    return;
                }

                const response: AxiosResponse<Utility[]> = await axios.get(
                    `http://localhost:8765/api/get-utility-by-type/${officeId}/${utilityId}/`,
                    {
                        headers: {Authorization: `Bearer ${token}`},
                    }
                );
                setUtilities(response.data);
            } catch (error) {
                setError("Не вдалося завантажити комунальні послуги. Спробуйте пізніше.");
                console.error("Помилка завантаження даних:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [officeId]);

    return {utilities, loading, error};
};

export default UseFetchUtilitiesData;