import {createBrowserRouter, Navigate, redirect, RouteObject} from 'react-router-dom';
import App from "../App.tsx";
import HomePage from "../pages/HomePage.tsx";
import SignUpPage from "../pages/SignUpPage.tsx";
import LogIn from "../pages/LogIn.tsx";
import MainPage from "../pages/MainPage.tsx";


const rootLoader = async (): Promise<null | Response> => {
    const token: string = localStorage.getItem("jwtToken");

    if (!token && location.pathname === "/") {
        return redirect("/home");
    }

    if (!token) {
        return redirect("/login");
    }
    return null;
};

const routes: RouteObject[] = [
    {
        path: "/",
        element: <App/>,
        loader: rootLoader,
        children: [
            {
                path: "/",
                element: <Navigate to="/main" replace/>,
            },
            {
                path: "/main",
                element: <MainPage/>,
            },
        ],
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
        element: <SignUpPage/>,
    },
];


export const router = createBrowserRouter(routes);
