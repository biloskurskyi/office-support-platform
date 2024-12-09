import React, {useEffect} from 'react';
import {useOutletContext, useParams} from "react-router-dom";
import useFetchOrders from "../hooks/useFetchOrders.tsx";
import {Box, CircularProgress} from "@mui/material";
import NoExistCard from "../components/NoExistCard/NoExistCard.tsx";
import PageWrapper from "../components/MainPageComponents/PageWrapper.tsx";
import InfoBlocks from "../components/MainPageComponents/UI/InfoBlocks.tsx";
import OrderCard from "../components/OrdersComponents/UI/OrderCard.tsx";
import ErrorMessage from "../components/OfficesListOwnerComponent/UI/ErrorMessage.tsx";

const OrdersList = () => {
    const {setText} = useOutletContext<{ setText: (text: React.ReactNode) => void }>();

    useEffect(() => {
        setText(<h2>Перелік замовлень для офісу</h2>);
    }, [setText]);

    const {id} = useParams<{ id: string }>();
    const {orders, loading, error} = useFetchOrders(id);

    if (loading) {
        return <CircularProgress/>;
    }

    if (error) return <ErrorMessage message={error}/>;

    if (!orders.length) {
        return (
            <NoExistCard
                title="Замовлень не знайдено"
                message="Здається, у ціього офісу ще немає замовлень. Ви можете створити нове замовленн
                 за допомогою кнопки нижче."
                buttonText="Створити замовлення"
                buttonLink={`/provider-create/${id}`}
            />
        );
    }

    return (
        <div>
            <PageWrapper>
                <div style={{height: '500px'}}/>
                <InfoBlocks
                    blocksData={orders.map((order) => ({
                        title: `Назва замовлення: ${order.title}`,
                        content: <OrderCard order={order}/>,
                    }))}
                />
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                }}>
                    {/*<CreateProviderButton companyId={id}/>*/}
                </Box>
                <div style={{height: '50px'}}/>
            </PageWrapper>
        </div>
    );
};

export default OrdersList;