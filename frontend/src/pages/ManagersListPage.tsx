import React, {useEffect} from 'react';
import {
    Link,
    useNavigate,
    useOutletContext,
    useParams,
} from 'react-router-dom';
import {
    Box,
    CardActions,
    CircularProgress,
} from '@mui/material';
import ErrorMessage from '../components/OfficesListOwnerComponent/UI/ErrorMessage.tsx';
import InfoBlocks from '../components/MainPageComponents/UI/InfoBlocks.tsx';
import PageWrapper from '../components/MainPageComponents/PageWrapper.tsx';
import ManagerCard from '../components/ManagerCard/UI/ManagerCard.tsx';
import useFetchManagers from '../hooks/useFetchManagers.tsx';
import CreateManagerButton from '../components/ManagersList/UI/CreateManagerButton.tsx';
import NoExistCard from '../components/NoExistCard/NoExistCard.tsx';
import DownloadPDFButton from "../components/DownloadPDFButton/DownloadPDFButton.tsx";

const ManagersListPage = () => {
    const {setText} = useOutletContext<{
        setText: (text: React.ReactNode) => void;
    }>();

    useEffect(() => {
        setText(<h2>Перелік менеджерів компанії</h2>);
    }, [setText]);

    const navigate = useNavigate();

    const user_type = localStorage.getItem('user_type');

    if (user_type !== '1') {
        navigate('/error');
    }

    const {id} = useParams<{ id: string }>();
    const {managers, loading, error} = useFetchManagers(id);

    if (loading) {
        return <CircularProgress/>;
    }

    if (error) return <ErrorMessage message={error}/>;

    if (!managers.length) {
        return (
            <NoExistCard
                title="Менеджерів не знайдено"
                message="Здається, у цієї компанії ще немає менеджерів. Ви можете створити нового менеджера за допомогою кнопки нижче."
                buttonText="Створити менеджера"
                buttonLink={`/create-manager/${id}`}
            />
        );
    }

    const pdf_url = `http://localhost:8765/api/company/${id}/managers/pdf/`;
    console.log(pdf_url);

    return (
        <div>
            <PageWrapper>
                <div style={{height: '500px'}}/>
                <InfoBlocks
                    blocksData={managers.map((manager) => ({
                        title: manager.email,
                        content: <ManagerCard manager={manager}/>,
                    }))}
                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                    }}
                ></Box>
            </PageWrapper>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '20px', // Відступи між кнопками
                    marginTop: '20px',
                }}
            >
                <CardActions sx={{justifyContent: 'center'}}>
                    <CreateManagerButton companyId={id}/>
                </CardActions>
                <DownloadPDFButton apiUrl={pdf_url}/>
            </Box>
            <div style={{height: '50px'}}/>
        </div>
    );
};

export default ManagersListPage;
