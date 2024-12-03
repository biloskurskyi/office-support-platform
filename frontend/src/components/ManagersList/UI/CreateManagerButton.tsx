import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

interface Props {
    companyId: string | undefined;
}

const CreateManagerButton: React.FC<Props> = ({ companyId }) => (
    <Link to={`/create-manager/${companyId}`}>
        <Button
            variant="contained"
            sx={{
                backgroundColor: "#1976d2",
                color: "#fff",
                "&:hover": {
                    backgroundColor: "#155a9c",
                },
            }}
        >
            Створити менеджера
        </Button>
    </Link>
);

export default CreateManagerButton;
