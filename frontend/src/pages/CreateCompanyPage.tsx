import React, {useEffect} from 'react';
import {useNavigate, useOutletContext} from "react-router-dom";
import CreateCompanyForm from "../components/CreateCompanyForm/CreateCompanyForm.tsx";

const CreateCompanyPage = () => {
    const {setText} = useOutletContext<{ setText: (text: React.ReactNode) => void }>();

    useEffect(() => {

        setText(<h3>Створіть свою компанію і відкрийте нові можливості для розвитку!</h3>);
    }, [setText]);

    const navigate = useNavigate();

    const user_type = localStorage.getItem("user_type")

    console.log("user_type" + user_type)
    if (user_type !== '1') {
        navigate("/error");
    }

    return (
        <div>
            <div style={{height: '500px'}}/>
            <CreateCompanyForm/>
            <div style={{height: '50px'}}/>
        </div>
    );
};

export default CreateCompanyPage;