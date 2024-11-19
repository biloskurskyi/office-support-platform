import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useDataCompanyOffice} from "../../../context/useDataCompanyOffice.tsx";

const MenuButton: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [submenuAnchorEl, setSubmenuAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

    // Use data from context
    const { companies, offices, isManagerWithoutOffices, loading } =
        useDataCompanyOffice();

    const isSmallScreen = useMediaQuery('(max-width:500px)');

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

    return (
        <div>
            <Button color="inherit" startIcon={<MenuIcon />} onClick={handleMenuClick}>
                Меню
            </Button>

            {/* Main Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                {localStorage.getItem('jwtToken') ? (
                    localStorage.getItem('user_type') === '2' ? (
                        offices.length > 0 ? (
                            offices.map((office) => (
                                <MenuItem key={office.id} onClick={handleOfficeClick}>
                                    {isSmallScreen
                                        ? <>{office.city}, {office.country},<br />{office.address}</>
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
                                    ? <>Створіть компанію,<br />щоб почати управляти вже зараз</>
                                    : 'Створіть компанію, щоб почати управляти вже зараз'}
                            </MenuItem>
                        )
                    )
                ) : (
                    <MenuItem onClick={handleMenuClose}>
                        <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                            {isSmallScreen
                                ? <>Увійдіть,<br />щоб побачити перелік можливостей</>
                                : 'Увійдіть, щоб побачити перелік можливостей'}
                        </Link>
                    </MenuItem>
                )}
            </Menu>

            {/* Submenu for selected company */}
            <Menu
                anchorEl={submenuAnchorEl}
                open={Boolean(submenuAnchorEl)}
                onClose={handleSubmenuClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
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
