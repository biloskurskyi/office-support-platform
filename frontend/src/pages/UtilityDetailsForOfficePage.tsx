import React, {useEffect} from 'react';
import {useOutletContext, useParams} from 'react-router-dom';
import useFetchUtilitiesData from '../hooks/useFetchUtilitiesData.tsx';
import {Box, CircularProgress} from '@mui/material';
import ErrorMessage from '../components/OfficesListOwnerComponent/UI/ErrorMessage.tsx';
import NoExistCard from '../components/NoExistCard/NoExistCard.tsx';
import PageWrapper from '../components/MainPageComponents/PageWrapper.tsx';
import InfoBlocks from '../components/MainPageComponents/UI/InfoBlocks.tsx';
import UtilityCard from '../components/UtilitiesComponents/UI/UtilityCard.tsx';
import DownloadPDFButton from "../components/DownloadPDFButton/DownloadPDFButton.tsx";
import ActionButton from "../components/ActionButton/ActionButton.tsx";
import UtilityListBlueButton from "../components/UtilitiesComponents/UI/UtilityListBlueButton.tsx";

const UtilityDetailsForOfficePage = () => {
    const {setText} = useOutletContext<{
        setText: (text: React.ReactNode) => void;
    }>();

    useEffect(() => {
        setText(<h2>Перелік комунальних послуг для офісу</h2>);
    }, [setText]);

    const {officeId, utilityId} = useParams<{ id: string }>();
    const {utilities, loading, error} = useFetchUtilitiesData(
        officeId,
        utilityId
    );

    if (loading) {
        return <CircularProgress/>;
    }

    if (error) return <ErrorMessage message={error}/>;

    if (!utilities.length) {
        return (
            <NoExistCard
                title="Комунальних послуг не знайдено"
                message="Здається, цієї послуги для данного офісу ще немає. Ви можете створити нову комунальну послугу
                 за допомогою кнопки нижче."
                buttonText="Створити комунальну послугу"
                buttonLink={`/utility-create/${officeId}`}
            />
        );
    }

    const pdf_url = `http://localhost:8765/api/utility/pdf/${officeId}/${utilityId}`;

    return (
        <div>
            <PageWrapper>
                <div style={{height: '500px'}}/>
                <InfoBlocks
                    blocksData={utilities.map((utility) => ({
                        title: `Дата послуги: ${utility.date}`,
                        content: <UtilityCard utility={utility}/>,
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
                    <ActionButton to={`/utility-create/${officeId}`} label="Створити комунальну послугу"/>
                    <DownloadPDFButton apiUrl={pdf_url}/>
                    <UtilityListBlueButton id={officeId}/>
                </Box>

                <div style={{height: '50px'}}/>
            </PageWrapper>
        </div>
    );
};

export default UtilityDetailsForOfficePage;
