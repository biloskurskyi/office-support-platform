import { useState, useEffect } from 'react';

const useUserType = () => {
    const [userType, setUserType] = useState<string | null>(null);

    useEffect(() => {
        const storedUserType = localStorage.getItem('user_type');
        if (storedUserType) {
            setUserType(storedUserType);
        }
    }, []);

    return userType;
};

export default useUserType;
