import {createBrowserRouter, Navigate, redirect, RouteObject} from 'react-router-dom';
import App from "../App.tsx";
import HomePage from "../pages/HomePage.tsx";
import SignUpPage from "../pages/SignUpPage.tsx";
import LogInPage from "../pages/LogInPage.tsx";
import MainPage from "../pages/MainPage.tsx";
import UserPage from "../pages/UserPage.tsx";
import ChangePasswordPage from "../pages/ChangePasswordPage.tsx";
import CompanyEditPage from "../pages/CompanyEditPage.tsx";
import CreateCompanyPage from "../pages/CreateCompanyPage.tsx";
import ActivateUserPage from "../pages/ActivateUserPage.tsx";
import OfficeEditPage from "../pages/OfficeEditPage.tsx";
import OfficesListOwnerPage from "../pages/OfficesListOwnerPage.tsx";
import ManagersListPage from "../pages/ManagersListPage.tsx";
import ManagerCreatePage from "../pages/ManagerCreatePage.tsx";
import ProviderListPage from "../pages/ProviderListPage.tsx";
import ProviderEditPage from "../pages/ProviderEditPage.tsx";
import OfficeCreatePage from "../pages/OfficeCreatePage.tsx";
import ProviderCreatePage from "../pages/ProviderCreatePage.tsx";
import OfficeOrdersOverviewPage from "../pages/OfficeOrdersOverviewPage.tsx";


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
            {
                path: "/user",
                element: <UserPage/>,
            },
            {
                path: '/change-password',
                element: <ChangePasswordPage/>
            },
            {
                path: '/company/:id',
                element: <CompanyEditPage/>
            },
            {
                path: "/company-create",
                element: <CreateCompanyPage/>
            },
            {
                path: '/office/:id',
                element: <OfficeEditPage/>
            },
            {
                path: "/office-list/:id",
                element: <OfficesListOwnerPage/>
            },
            {
                path: "/company/:id/managers",
                element: <ManagersListPage/>
            },
            {
                path: "/create-manager/:id",
                element: <ManagerCreatePage/>
            },
            {
                path: "/provider-list/:id",
                element: <ProviderListPage/>
            },
            {
                path: "/provider/:id",
                element: <ProviderEditPage/>
            },
            {
                path: "/office-create/:id",
                element: <OfficeCreatePage/>
            },
            {
                path: "/provider-create/:id",
                element: <ProviderCreatePage/>
            },
            {
                path: "/office-overview/:id",
                element: <OfficeOrdersOverviewPage/>
            }
        ],
    },
    {
        path: "/home",
        element: <HomePage/>,
    },
    {
        path: "/login",
        element: <LogInPage/>,
    },
    {
        path: "/signup",
        element: <SignUpPage/>,
    },
    {
        path: "/activate-user/:id",
        element: <ActivateUserPage/>,
    }
];


export const router = createBrowserRouter(routes);
