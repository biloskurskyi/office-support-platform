import React from 'react';
import {Box} from '@mui/material';
import InfoBlocks from '../MainPageComponents/UI/InfoBlocks';
import OfficeCard from '../OfficesListOwnerComponent/UI/OfficeCard';
import CreateOfficeButton from '../OfficesListOwnerComponent/UI/CreateOfficeButton';
import {Office} from '../../hooks/useFetchOffices';
import DownloadPDFButton from "../DownloadPDFButton/DownloadPDFButton.tsx";
import ActionButton from "../ActionButton/ActionButton.tsx";
import {c} from "vite/dist/node/types.d-aGj9QkWt";

interface OfficesListProps {
    offices: Office[];
    companyId: string | undefined;
}

const OfficesList: React.FC<OfficesListProps> = ({offices, companyId}) => {
    const pdf_url = `http://localhost:8765/api/company/${companyId}/offices/pdf/`;

    return (
        <>
            <InfoBlocks
                blocksData={offices.map((office) => ({
                    title: office.city,
                    content: <OfficeCard office={office}/>,
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
                <ActionButton to={`/office-create/${companyId}`} label="Створити офіс"/>
                <DownloadPDFButton apiUrl={pdf_url}/>
            </Box>
        </>
    );
};

export default OfficesList;
