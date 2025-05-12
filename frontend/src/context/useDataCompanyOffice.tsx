import React, {createContext, useContext, useEffect, useState} from 'react';
import axios, {AxiosResponse} from 'axios';

interface Company {
    id: number;
    name: string;
    legal_name: string;
    owner: number;
    description: string;
    website: string;
    created_at: string;
}

interface Office {
    id: number;
    address: string;
    city: string;
    country: string;
    postal_code: string;
    phone_number: string;
    manager: number;
    company: number;
}

interface DataContextProps {
    companies: Company[];
    offices: Office[];
    isManagerWithoutOffices: boolean;
    loading: boolean;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                          children,
                                                                      }) => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [offices, setOffices] = useState<Office[]>([]);
    const [isManagerWithoutOffices, setIsManagerWithoutOffices] =
        useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const userType = localStorage.getItem('user_type');

                if (!token) {
                    if (!window.__loggedNoToken) {
                        console.error('Токен не знайдений');
                        window.__loggedNoToken = true;
                    }
                    return;
                }

                if (userType === '1') {
                    // Власник
                    const response: AxiosResponse<Company[]> = await axios.get(
                        'http://localhost:8765/api/company/',
                        {
                            headers: {Authorization: `Bearer ${token}`},
                        }
                    );
                    setCompanies(response.data);
                } else if (userType === '2') {
                    // Менеджер
                    const response: AxiosResponse<Office[]> = await axios.get(
                        'http://localhost:8765/api/office-list/',
                        {
                            headers: {Authorization: `Bearer ${token}`},
                        }
                    );
                    setOffices(response.data);
                    setIsManagerWithoutOffices(response.data.length === 0);
                }
            } catch (error) {
                console.error('Помилка завантаження даних:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <DataContext.Provider
            value={{companies, offices, isManagerWithoutOffices, loading}}
        >
            {children}
        </DataContext.Provider>
    );
};

export const useDataCompanyOffice = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
