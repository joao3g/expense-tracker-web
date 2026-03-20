import { createBrowserRouter, redirect } from "react-router"
import * as expenseService from "./api/services/expense.service"
import * as incomeService from "./api/services/income.service"
import LoginPage from "./pages/LoginPage"
import Dashboard from "./pages/Dashboard"
import AppLayout from "./layouts/AppLayout"
import { getMonthOffset } from "./utils"

export const router = createBrowserRouter([
    {
        path: "/login",
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
        loader: authMiddleware,
        element: <AppLayout />,
        children: [
            {
                loader: getDashboardData,
                element: <Dashboard />,
                path: "/dashboard"
            },
            {
                path: "/group",
                element: <h1>/Group</h1>,
            },
        ],
    },
])

function authMiddleware() {
    const token = localStorage.getItem("token");

    if (!token) {
        throw redirect("/login");
    }

    return null;
}

async function getDashboardData({ request }: { request: Request }) {
    try {
        authMiddleware();

        const url = new URL(request.url);
        const dateParam = url.searchParams.get("date");
        
        const date = dateParam ? new Date(`${dateParam}T00:00`) : new Date();

        const [expenses, incomes, expensesSummarized, expensesTotal, incomesTotal] = await Promise.all([
            await expenseService.getExpensesByMonth(getMonthOffset(date, 0)),
            await incomeService.getIncomesByMonth(getMonthOffset(date, 0)),
            await expenseService.getExpensesSummarizedByMonth(getMonthOffset(date, 0)),
            [
                await expenseService.getExpensesTotalByMonth(getMonthOffset(date, 0)),
                await expenseService.getExpensesTotalByMonth(getMonthOffset(date, -1)),
                await expenseService.getExpensesTotalByMonth(getMonthOffset(date, -2)),
                await expenseService.getExpensesTotalByMonth(getMonthOffset(date, -3)),
            ],
            [
                await incomeService.getIncomesTotalByMonth(getMonthOffset(date, 0)),
                await incomeService.getIncomesTotalByMonth(getMonthOffset(date, -1)),
                await incomeService.getIncomesTotalByMonth(getMonthOffset(date, -2)),
                await incomeService.getIncomesTotalByMonth(getMonthOffset(date, -3)),
            ]
        ]);

        return { expenses, incomes, expensesSummarized, expensesTotal, incomesTotal };
    } catch (e) {
        if (e instanceof Response) {
            throw e;
        }

        throw redirect("/error");
    }
}