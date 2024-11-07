import {createBrowserRouter, Navigate, RouteObject} from 'react-router-dom';
import App from "../App.tsx";
import HomePage from "../pages/HomePage.tsx";

const routes: RouteObject[] = [
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "/",
                element: <Navigate to="/home" replace/>,
            },
            {
                path: "/home",
                element: <HomePage/>,
            },
        ]
    },
];

export const router = createBrowserRouter(routes);
