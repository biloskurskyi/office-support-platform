// hooks/useFetchManagers.ts
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

interface Manager {
    id: number;
    surname: string;
    name: string;
    email: string;
    user_type: number;
    info: string;
    company: number;
    is_active: boolean;
}

const useFetchManagers = (id: string | undefined) => {
    const [managers, setManagers] = useState<Manager[]>([]);
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

                const response: AxiosResponse<Manager[]> = await axios.get(
                    `http://localhost:8765/api/company/${id}/managers/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setManagers(response.data);
            } catch (error) {
                setError("Не вдалося завантажити менеджерів. Спробуйте пізніше.");
                console.error("Помилка завантаження даних:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return { managers, loading, error };
};

export default useFetchManagers;
