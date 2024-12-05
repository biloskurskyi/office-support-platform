import React from "react";
import { Box } from "@mui/material";
import InfoBlocks from "../MainPageComponents/UI/InfoBlocks";
import OfficeCard from "../OfficesListOwnerComponent/UI/OfficeCard";
import CreateOfficeButton from "../OfficesListOwnerComponent/UI/CreateOfficeButton";
import { Office } from "../../hooks/useFetchOffices";

interface OfficesListProps {
    offices: Office[];
    companyId: string | undefined;
}

const OfficesList: React.FC<OfficesListProps> = ({ offices, companyId }) => {
    return (
        <>
            <InfoBlocks
                blocksData={offices.map((office) => ({
                    title: office.city,
                    content: <OfficeCard office={office} />,
                }))}
            />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <CreateOfficeButton companyId={companyId} />
            </Box>
        </>
    );
};

export default OfficesList;
