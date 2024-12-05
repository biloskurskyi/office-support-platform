import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";

export interface Office {
    id: number;
    city: string;
    address: string;
    country: string;
    postal_code: string;
    phone_number: string;
}

const useFetchOffices = (companyId: string | undefined) => {
    const [offices, setOffices] = useState<Office[]>([]);
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

                if (userType !== "1") {
                    setError("У вас немає прав для перегляду офісів.");
                    return;
                }

                const response: AxiosResponse<Office[]> = await axios.get(
                    `http://localhost:8765/api/office-list-company/${companyId}/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setOffices(response.data);
            } catch (error) {
                setError("Не вдалося завантажити офіси. Спробуйте пізніше.");
                console.error("Помилка завантаження даних:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [companyId]);

    return { offices, loading, error };
};

export default useFetchOffices;
