import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const useAccessToProvider = (companyId: string | undefined): boolean | null => {
    const navigate = useNavigate();
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAccessToProvider = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8765/api/access-provider-check/${companyId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                        },
                    }
                );

                if (response.status === 200) {
                    setHasAccess(true);
                } else {
                    setHasAccess(false);
                    navigate("/");
                }
            } catch (error) {
                console.error("Помилка перевірки доступу до постачальника:", error);
                setHasAccess(false);
                navigate("/error");
            }
        };

        if (companyId) {
            checkAccessToProvider();
        } else {
            setHasAccess(false);
            navigate("/");
        }
    }, [companyId, navigate]);

    return hasAccess;
};

export default useAccessToProvider;
