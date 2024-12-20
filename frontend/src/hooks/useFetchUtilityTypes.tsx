import React, {useEffect, useState} from 'react';
import {Office} from "./useFetchOffices.tsx";
import axios, {AxiosResponse} from "axios";

export interface Utility {
    id: number;
    utilities_type: string;
}

const UseFetchUtilityTypes = (officeId: string | undefined) => {
    const [utility, setUtility] = useState<Utility[]>([]);
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
                    `http://localhost:8765/api/utilities/types/${officeId}/`,
                    {
                        headers: {Authorization: `Bearer ${token}`},
                    }
                );
                setUtility(response.data);
            } catch (error) {
                setError("Не вдалося завантажити комунальні послуги. Спробуйте пізніше.");
                console.error("Помилка завантаження даних:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [officeId]);

    return {utility, loading, error};
};

export default UseFetchUtilityTypes;