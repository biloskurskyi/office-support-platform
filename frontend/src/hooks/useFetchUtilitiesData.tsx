import React, {useEffect, useState} from 'react';
import axios, {AxiosResponse} from "axios";
import {useNavigate} from "react-router-dom";
import useFetchUtilityTypes from "./useFetchUtilityTypes.tsx";

export interface Utility {
    id: number;
    utilities_type_display: string;
    date: string;
    counter: number;
    price: number;
    office_display: string;
}


const UseFetchUtilitiesData = (officeId: string | undefined, utilityId: string | undefined) => {
    // const {utility, loading: utilityLoading, error: utilityError} = useFetchUtilityTypes(utilityId);
    const [utilities, setUtilities] = useState<Utility[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    // console.log(utility)
    console.log(utilityId)

    if (utilityId < 0 || utilityId > 5) {
        navigate("/error")
    }

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
                navigate("/error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [officeId]);

    return {utilities, loading, error};
};

export default UseFetchUtilitiesData;