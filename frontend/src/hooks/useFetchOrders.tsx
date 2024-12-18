import React from 'react';
import {useState, useEffect} from "react";
import axios, {AxiosResponse} from "axios";

export interface Order {
    id: number;
    title: string;
    description: string;
    deal_value: number;
    currency_name: string;
    file: string;
    provider_name: number;
    office_phone_number: number;
    provider_id: number;
}

const UseFetchOrders = (officeId: string | undefined) => {
    const [orders, setOrders] = useState<Order[]>([]);
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

                const response: AxiosResponse<Order[]> = await axios.get(
                    `http://localhost:8765/api/get-all-orders-for-office/${officeId}/`,
                    {
                        headers: {Authorization: `Bearer ${token}`},
                    }
                );
                setOrders(response.data);
            } catch (error) {
                setError("Не вдалося завантажити офіси. Спробуйте пізніше.");
                console.error("Помилка завантаження даних:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [officeId]);

    return {orders, loading, error};
};

export default UseFetchOrders;