import React, {useState, useEffect} from 'react';
import {Button, Menu, MenuItem} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
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

const MenuButton: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [submenuAnchorEl, setSubmenuAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                console.log('Token:', token);

                if (!token) {
                    console.error('Токен не знайдений');
                    return;
                }
                if (token) {
                    const response: AxiosResponse<any> = await axios.get('http://localhost:8765/api/company/', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setCompanies(response.data);
                } else {
                    console.error("Токен не знайдено");
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

    return (
        <div>
            <Button color="inherit" startIcon={<MenuIcon/>} onClick={handleMenuClick}>
                Меню
            </Button>

            {/* Main Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(!!anchorEl)} onClose={handleMenuClose}>
                {companies.map((company) => (
                    <MenuItem key={company.id} onClick={(e) => handleCompanyClick(e, company.name)}>
                        {company.name}
                    </MenuItem>
                ))}
            </Menu>

            {/* Submenu for selected company */}
            <Menu
                anchorEl={submenuAnchorEl}
                open={Boolean(!!submenuAnchorEl)}
                onClose={handleSubmenuClose}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'left'}}
            >
                <MenuItem onClick={handleSubmenuClose}>Менеджери</MenuItem>
                <MenuItem onClick={handleSubmenuClose}>Офіси</MenuItem>
                <MenuItem onClick={handleSubmenuClose}>Комунальні послуги</MenuItem>
                <MenuItem onClick={handleSubmenuClose}>Замовлення</MenuItem>
                <MenuItem onClick={handleSubmenuClose}>Провайдери</MenuItem>
                <MenuItem onClick={handleSubmenuClose}>Налаштування компанії</MenuItem>
            </Menu>
        </div>
    );
};

export default MenuButton;
