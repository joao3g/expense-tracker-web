import { api } from "./client";
import type { ExpenseCreate, Expense, ExpenseSummarized, ExpenseTotal, ExpenseUpdate } from "../types/expense";

export const createExpense = async (expenseData: ExpenseCreate) => {
    await api.post<void>(`/expense/create`, expenseData);
}

export const updateExpense = async (expenseData: ExpenseUpdate) => {
    await api.patch<void>(`/expense/update`, expenseData);
}

export const getExpensesByMonth = async (date: Date) => {
    const { data } = await api.get<Expense[]>(`/expense/getByMonth/${date.toLocaleDateString("en-CA")}`);

    return data;
};

export const getExpensesSummarizedByMonth = async (date: Date) => {
    const { data } = await api.get<ExpenseSummarized>(`/expense/getSummarizedByMonth/${date.toLocaleDateString("en-CA")}`);

    return data;
};

export const getExpensesTotalByMonth = async (date: Date) => {
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0);
    startDate.setUTCDate(1);

    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setUTCDate(0);

    const { data } = await api.post<ExpenseTotal>(`/expense/totalByRange`, {
        startDate: startDate.toLocaleDateString("en-CA"),
        endDate: endDate.toLocaleDateString("en-CA")
    });

    return data;
};

export const deleteExpense = async (incomeId: string) => {
    await api.delete<void>(`/expense/remove/${incomeId}`);
};