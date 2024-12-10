import React, {useState} from 'react';
import {Button, Menu, MenuItem} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {Link} from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useDataCompanyOffice} from "../../../context/useDataCompanyOffice.tsx";
import CreateCompanyButton from "../../MainPageComponents/UI/CreateCompanyButton.tsx";

const MenuButton: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [submenuAnchorEl, setSubmenuAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [selectedOffice, setSelectedOffice] = useState<number | null>(null);


    // Use data from context
    const {companies, offices, isManagerWithoutOffices, loading} =
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

    const handleOfficeClick = (event: React.MouseEvent<HTMLElement>, office: string) => {
        setSelectedOffice(office);
        setSubmenuAnchorEl(event.currentTarget);
    };

    const handleSubmenuItemClick = () => {
        handleMenuClose(); // Закриваємо обидва меню
    };

    console.log(selectedCompany)
    // console.log("OFFICES", offices[0])

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
                                <MenuItem key={office.id} onClick={(o) => handleOfficeClick(o, office.phone_number)}>
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
                                <MenuItem key={company.id} onClick={(e) => handleCompanyClick(e, company.legal_name)}>
                                    {company.legal_name}
                                </MenuItem>
                            ))
                        ) : (
                            <Link to="/company-create" style={{
                                textDecoration: 'none',
                                color: 'inherit'
                            }}>{localStorage.getItem('user_type') === '1'}
                                <MenuItem onClick={handleMenuClose}>
                                    {isSmallScreen
                                        ? <>Створіть компанію,<br/>щоб почати управляти вже зараз</>
                                        : 'Створіть компанію, щоб почати управляти вже зараз'}
                                </MenuItem></Link>
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
                        <Link
                            to={`/company/${Array.isArray(companies) ? companies.find(c => c.legal_name === selectedCompany)?.id : ''}/managers/`}
                            style={{textDecoration: 'none', color: 'inherit'}}>
                            <MenuItem key="managers" onClick={handleSubmenuItemClick}>Менеджери</MenuItem>
                        </Link>,
                        <Link
                            to={`/office-list/${Array.isArray(companies) ? companies.find(c => c.legal_name === selectedCompany)?.id : ''}`}
                            style={{textDecoration: 'none', color: 'inherit'}}>
                            <MenuItem key="offices" onClick={handleSubmenuItemClick}>
                                Офіси
                            </MenuItem>
                        </Link>,
                        <MenuItem key="communal" onClick={handleSubmenuItemClick}>Комунальні послуги</MenuItem>,
                        <Link
                            to={`/office-overview/${Array.isArray(companies) ? companies.find(
                                c => c.legal_name === selectedCompany)?.id : ''}`}
                            style={{textDecoration: 'none', color: 'inherit'}}>
                            <MenuItem key="orders" onClick={handleSubmenuItemClick}>Замовлення</MenuItem>
                        </Link>,
                        <Link
                            to={`/provider-list/${Array.isArray(companies) ? companies.find(
                                c => c.legal_name === selectedCompany)?.id : ''}`}
                            style={{textDecoration: 'none', color: 'inherit'}}>
                            <MenuItem key="providers" onClick={handleSubmenuItemClick}>Постачальники</MenuItem>
                        </Link>,
                        <Link
                            to={`/company/${Array.isArray(companies) ? companies.find(
                                c => c.legal_name === selectedCompany)?.id : ''}`}
                            key="company-settings"
                            style={{textDecoration: 'none', color: 'inherit'}}>
                            <MenuItem key="company-settings" onClick={handleSubmenuItemClick}>
                                Налаштування компанії
                            </MenuItem>
                        </Link>
                    ]
                ) : localStorage.getItem('user_type') === '2' ? (
                    [
                        <MenuItem key="communal" onClick={handleSubmenuItemClick}>Комунальні послуги</MenuItem>,
                        // fix this problem
                        <Link
                            to={`/order-list/${Array.isArray(offices) ? offices.find(o => o.phone_number === selectedOffice)?.id : ''}`}
                            style={{textDecoration: 'none', color: 'inherit'}}
                        >
                            <MenuItem key="orders" onClick={handleSubmenuItemClick}>Замовлення</MenuItem>
                        </Link>,
                        <Link
                            to={`/provider-list/${
                                Array.isArray(offices) && offices.length > 0
                                    ? offices[0].company_id // Використовуємо компанію, до якої належить перший офіс
                                    : ''
                            }`}
                            style={{textDecoration: 'none', color: 'inherit'}}
                        >
                            <MenuItem key="providers" onClick={handleSubmenuItemClick}>Постачальники</MenuItem>
                        </Link>
                        ,
                        <Link
                            to={`/office/${Array.isArray(offices) ? offices.find(o => o.phone_number === selectedOffice)?.id : ''}`} // Використовуємо ID вибраного офісу
                            key="office-settings"
                            style={{textDecoration: 'none', color: 'inherit'}}
                        >
                            <MenuItem key="office-settings" onClick={handleSubmenuItemClick}>
                                Налаштування офісу
                            </MenuItem>
                        </Link>
                    ]
                ) : (
                    <MenuItem onClick={handleSubmenuItemClick}>Немає доступу</MenuItem>
                )}

            </Menu>
        </div>
    );
};

export default MenuButton;
