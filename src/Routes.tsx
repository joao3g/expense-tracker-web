import { createBrowserRouter, redirect } from "react-router";
import LoginPage from "./pages/Login";
import IncomesPage from "./pages/Incomes";
import ExpensesPage from "./pages/Expenses";
import CategoriesPage from "./pages/Categories";
import Dashboard from "./pages/Dashboard";
import ComponentsPage from "./pages/Components";
import AppLayout from "./layouts/AppLayout";
import { authMiddleware } from "./loaders/auth";
import { categoriesLoader } from "./loaders/categories";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />,
        loader: () => {
            if (localStorage.getItem("token")) throw redirect("/dashboard")
        },
    },
    {
        path: "/error",
        element: <h1>Error page</h1>
    },
    {
        path: "/components",
        element: <ComponentsPage />,
    },
    {
        loader: authMiddleware,
        element: <AppLayout />,
        children: [
            {
                loader: authMiddleware,
                element: <Dashboard />,
                path: "/dashboard"
            },
            {
                loader: authMiddleware,
                path: "/incomes",
                element: <IncomesPage />,
            },
            {
                loader: authMiddleware,
                path: "/expenses",
                element: <ExpensesPage />,
            },
            {
                loader: categoriesLoader(queryClient),
                path: "/categories",
                element: <CategoriesPage />,
            },
        ],
    },
]);