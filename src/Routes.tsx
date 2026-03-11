import { createBrowserRouter, redirect } from "react-router";
import LoginPage from "./pages/LoginPage";

export const router = createBrowserRouter([
    { 
        path: "/login",
        Component: LoginPage,
        loader: () => { if (localStorage.getItem("token")) return redirect("/group"); }
    },
    { 
        path: "/register", 
        element: <h1>/Register</h1>,
        middleware: [authMiddleware]
    },
    { 
        path: "/dashboard", 
        element: <h1>/Dashboard</h1>,
        middleware: [authMiddleware]
    },
    { 
        path: "/expenses", 
        element: <h1>/Expenses</h1>,
        middleware: [authMiddleware]
    },
    { 
        path: "/goals", 
        element: <h1>/Goals</h1>,
        middleware: [authMiddleware]
    },
    { 
        path: "/group", 
        element: <h1>/Group</h1>,
        middleware: [authMiddleware]
    },
]);

async function authMiddleware() {
    const token = localStorage.getItem("token");

    if (!token) throw redirect("/login");
}