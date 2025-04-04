import React, {useEffect, useState} from 'react';
import {useOutletContext, useParams} from 'react-router-dom';
import {Box, CircularProgress} from '@mui/material';
import ErrorMessage from '../components/OfficesListOwnerComponent/UI/ErrorMessage.tsx';
import NoExistCard from '../components/NoExistCard/NoExistCard.tsx';
import PageWrapper from '../components/MainPageComponents/PageWrapper.tsx';
import InfoBlocks from '../components/MainPageComponents/UI/InfoBlocks.tsx';
import ProviderCard from '../components/ProviderComponents/UI/ProviderCard.tsx';
import useProviders from '../hooks/useProviders.tsx';
import CreateProviderButton from '../components/ProviderComponents/UI/CreateProviderButton.tsx';
import ActionButton from "../components/ActionButton/ActionButton.tsx";
import DownloadPDFButton from "../components/DownloadPDFButton/DownloadPDFButton.tsx";

// interface Provider {
//     id: number;
//     name: string;
//     address: string;
//     phone_number: string;
//     email: string;
//     company: string;
//     bank_details: string;
// }

const ProviderListPage: React.FC = () => {
    const {setText} = useOutletContext<{
        setText: (text: React.ReactNode) => void;
    }>();

    useEffect(() => {
        setText(<h2>Перелік постачальників для комапнії</h2>);
    }, [setText]);

    const {id} = useParams<{ id: string }>();
    const {providers, loading, error} = useProviders(id);

    if (loading) {
        return <CircularProgress/>;
    }

    if (error) return <ErrorMessage message={error}/>;

    if (!providers.length) {
        return (
            <NoExistCard
                title="Постачальників не знайдено"
                message="Здається, у цієї компанії ще немає постачальників. Ви можете створити нового постачальника за допомогою кнопки нижче."
                buttonText="Створити постачальника"
                buttonLink={`/provider-create/${id}`}
            />
        );
    }

    const pdf_url = `http://localhost:8765/api/provider/pdf/${id}/`;

    return (
        <div>
            <PageWrapper>
                <div style={{height: '500px'}}/>
                <InfoBlocks
                    blocksData={providers.map((provider) => ({
                        title: provider.name,
                        content: <ProviderCard provider={provider}/>,
                    }))}
                />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px',
                        marginTop: '20px',
                    }}
                >
                    <ActionButton to={`/provider-create/${id}`} label="Створити постачальника"/>
                    <DownloadPDFButton apiUrl={pdf_url}/>
                </Box>
                <div style={{height: '50px'}}/>
            </PageWrapper>
        </div>
    );
};

export default ProviderListPage;
