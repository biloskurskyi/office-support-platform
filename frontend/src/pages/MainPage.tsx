import React, {useEffect} from 'react';
import useUserType from '../hooks/useUserType';
import {useOutletContext, Link} from 'react-router-dom';
import {useDataCompanyOffice} from '../context/useDataCompanyOffice.tsx';
import {Grid, Paper, Typography, Box, Button} from '@mui/material';
import PageWrapper from '../components/MainPageComponents/PageWrapper.tsx';
import InfoBlocks from '../components/MainPageComponents/UI/InfoBlocks.tsx';
import UserWelcomeText from '../components/MainPageComponents/UI/UserWelcomeText.tsx';
import CreateCompanyButton from '../components/MainPageComponents/UI/CreateCompanyButton.tsx';

const MainPage = () => {
    const userType: string | null = useUserType();

    const {setText} = useOutletContext<{
        setText: (text: React.ReactNode) => void;
    }>();

    useEffect(() => {
        setText(<UserWelcomeText userType={userType}/>);
    }, [userType, setText]);

    const {companies, offices, isManagerWithoutOffices, loading} =
        useDataCompanyOffice();

    if (loading) {
        return <p>Завантаження...</p>;
    }

    const blocksData = companies.length
        ? companies.map((company) => ({
            title: company.name,
            content: (
                <>
                    <p>
                        <strong>Юридична назва:</strong> {company.legal_name}
                    </p>
                    <p>
                        <strong>Опис:</strong> {company.description}
                    </p>
                    <p>
                        <strong>Сайт:</strong>{' '}
                        <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {company.website}
                        </a>
                    </p>
                    <p>
                        <strong>Дата створення:</strong>{' '}
                        {new Date(company.created_at).toLocaleDateString()}
                    </p>
                    <Typography>
                        <Link
                            to={`/company/${company.id}`}
                            style={{textDecoration: 'none'}}
                        >
                            <Button
                                variant="outlined"
                                sx={{
                                    marginTop: '16px',
                                    padding: '6px 16px',
                                    fontSize: '0.875rem',
                                    borderRadius: '4px',
                                    borderColor: '#000',
                                    color: '#000',
                                    '&:hover': {
                                        borderColor: '#333',
                                        backgroundColor: '#f5f5f5',
                                    },
                                }}
                            >
                                Переглянути сторінку
                            </Button>
                        </Link>
                    </Typography>
                </>
            ),
        }))
        : offices.length
            ? offices.map((office) => ({
                title: office.city,
                content: (
                    <>
                        <p>
                            <strong>Адреса:</strong> {office.address}
                        </p>
                        <p>
                            <strong>Країна:</strong> {office.country}
                        </p>
                        <p>
                            <strong>Поштовий індекс:</strong> {office.postal_code}
                        </p>
                        <p>
                            <strong>Телефон:</strong> {office.phone_number}
                        </p>
                        <Typography>
                            <Link
                                to={`/office/${office.id}`}
                                style={{textDecoration: 'none'}}
                            >
                                <Button
                                    variant="outlined"
                                    sx={{
                                        marginTop: '16px',
                                        padding: '6px 16px',
                                        fontSize: '0.875rem',
                                        borderRadius: '4px',
                                        borderColor: '#000',
                                        color: '#000',
                                        '&:hover': {
                                            borderColor: '#333',
                                            backgroundColor: '#f5f5f5',
                                        },
                                    }}
                                >
                                    Переглянути сторінку
                                </Button>
                            </Link>
                        </Typography>
                    </>
                ),
            }))
            : null;

    return (
        <PageWrapper>
            <div style={{height: '500px'}}/>
            <InfoBlocks blocksData={blocksData}/>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <Link to="/company-create">
                    {userType === '1' && <CreateCompanyButton/>}
                </Link>
            </Box>
        </PageWrapper>
    );
};

export default MainPage;
