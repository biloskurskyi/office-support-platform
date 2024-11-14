import React, {useState, useEffect} from 'react';
import {Button, Menu, MenuItem} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import axios, {AxiosResponse} from 'axios';
import {Link} from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';

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

const MenuButton: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [submenuAnchorEl, setSubmenuAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [offices, setOffices] = useState<Office[]>([]);
    const [isManagerWithoutOffices, setIsManagerWithoutOffices] = useState<boolean>(false);


    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const userType = localStorage.getItem('user_type');
                console.log(userType)

                if (!token) {
                    console.error('Токен не знайдений');
                    return;
                }

                if (userType === '1') { // Власник
                    const response: AxiosResponse<any> = await axios.get('http://localhost:8765/api/company/', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setCompanies(response.data);
                } else if (userType === '2') { // Менеджер
                    const response: AxiosResponse<any> = await axios.get('http://localhost:8765/api/office-list/', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setOffices(response.data);

                    // Якщо менеджер не має офісів
                    if (response.data.length === 0) {
                        setIsManagerWithoutOffices(true);
                    }
                } else {
                    console.error('Невідомий тип користувача');
                }
            } catch (error) {
                console.error("Помилка завантаження компаній", error);
            }
        };

        fetchCompanies().catch((error) => {
            console.error('Promise rejected:', error);
        });
    }, []);

    // Main menu handlers
    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setSubmenuAnchorEl(null);
        setSelectedCompany(null);
    };

    // Submenu handlers
    const handleCompanyClick = (event: React.MouseEvent<HTMLElement>, company: string) => {
        setSelectedCompany(company);
        setSubmenuAnchorEl(event.currentTarget);
    };
    const handleSubmenuClose = () => {
        setSubmenuAnchorEl(null);
    };

    const handleOfficeClick = (event: React.MouseEvent<HTMLElement>) => {
        setSubmenuAnchorEl(event.currentTarget);
    };


    const isSmallScreen = useMediaQuery('(max-width:500px)');

    return (
        <div>
            <Button color="inherit" startIcon={<MenuIcon/>} onClick={handleMenuClick}>
                Меню
            </Button>

            {/* Main Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(!!anchorEl)} onClose={handleMenuClose}>
                {localStorage.getItem('jwtToken') ? (
                    localStorage.getItem('user_type') === '2' ? (
                        offices.length > 0 ? (
                            offices.map((office) => (
                                <MenuItem key={office.id} onClick={handleOfficeClick}>
                                    {isSmallScreen
                                        ? <>{office.city}, {office.country},<br/>{office.address}</>
                                        : <>{office.city}, {office.country}, {office.address}</>}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem onClick={handleMenuClose}>
                                {isSmallScreen
                                    ? <>Ви ще не прив'язані до офісу.</>
                                    : 'Ви ще не прив\'язані до офісу.'}
                            </MenuItem>
                        )
                    ) : (
                        companies.length > 0 ? (
                            companies.map((company) => (
                                <MenuItem key={company.id} onClick={(e) => handleCompanyClick(e, company.name)}>
                                    {company.name}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem onClick={handleMenuClose}>
                                {isSmallScreen
                                    ? <>Створіть компанію,<br/>щоб почати управляти вже зараз</>
                                    : 'Створіть компанію, щоб почати управляти вже зараз'}
                            </MenuItem>
                        )
                    )
                ) : (
                    <MenuItem onClick={handleMenuClose}>
                        <Link to="/login" style={{textDecoration: 'none', color: 'inherit'}}>
                            {isSmallScreen
                                ? <>Увійдіть,<br/>щоб побачити перелік можливостей</>
                                : 'Увійдіть, щоб побачити перелік можливостей'}
                        </Link>
                    </MenuItem>
                )}
            </Menu>


            {/* Submenu for selected company */}
            <Menu
                anchorEl={submenuAnchorEl}
                open={Boolean(!!submenuAnchorEl)}
                onClose={handleSubmenuClose}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'left'}}
            >
                {localStorage.getItem('user_type') === '1' ? (
                    [
                        <MenuItem key="managers" onClick={handleSubmenuClose}>Менеджери</MenuItem>,
                        <MenuItem key="offices" onClick={handleSubmenuClose}>Офіси</MenuItem>,
                        <MenuItem key="communal" onClick={handleSubmenuClose}>Комунальні послуги</MenuItem>,
                        <MenuItem key="orders" onClick={handleSubmenuClose}>Замовлення</MenuItem>,
                        <MenuItem key="providers" onClick={handleSubmenuClose}>Провайдери</MenuItem>,
                        <MenuItem key="company-settings" onClick={handleSubmenuClose}>Налаштування компанії</MenuItem>,
                    ]
                ) : localStorage.getItem('user_type') === '2' ? (
                    [
                        <MenuItem key="communal" onClick={handleSubmenuClose}>Комунальні послуги</MenuItem>,
                        <MenuItem key="orders" onClick={handleSubmenuClose}>Замовлення</MenuItem>,
                        <MenuItem key="providers" onClick={handleSubmenuClose}>Провайдери</MenuItem>,
                        <MenuItem key="office-settings" onClick={handleSubmenuClose}>Налаштування офісу</MenuItem>,
                    ]
                ) : (
                    <MenuItem onClick={handleSubmenuClose}>Немає доступу</MenuItem>
                )}
            </Menu>
        </div>
    );
};

export default MenuButton;
