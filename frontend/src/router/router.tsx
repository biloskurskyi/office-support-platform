import {createBrowserRouter, Navigate, RouteObject} from 'react-router-dom';
import App from "../App.tsx";
import HomePage from "../pages/HomePage.tsx";
import SignUpPage from "../pages/SignUpPage.tsx";
import LogIn from "../pages/LogIn.tsx";

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
            {
                path: "/login",
                element: <LogIn/>,
            },
            {
                path: "/signup",
                element: <SignUpPage/>
            }
        ]
    },
];

export const router = createBrowserRouter(routes);
