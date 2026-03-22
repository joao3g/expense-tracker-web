import { api } from "./client";
import type { IncomeCreate, Income, IncomeTotal, IncomeUpdate } from "../types/income";

export const createIncome = async (incomeData: IncomeCreate) => {
    await api.post<void>(`/income/create`, incomeData);
};

export const getIncomesByMonth = async (date: Date) => {
    const { data } = await api.get<Income[]>(`/income/getByMonth/${date.toLocaleDateString("en-CA")}`);

    return data;
};

export const getIncomesTotalByMonth = async (date: Date) => {
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0);
    startDate.setUTCDate(1);

    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setUTCDate(0);

    const { data } = await api.post<IncomeTotal>(`/income/totalByRange`, {
        startDate: startDate.toLocaleDateString("en-CA"),
        endDate: endDate.toLocaleDateString("en-CA")
    });

    return data;
};

export const updateIncome = async (incomeData: IncomeUpdate) => {
    await api.patch<void>(`/income/update`, incomeData);
};

export const deleteIncome = async (incomeId: string) => {
    await api.delete<void>(`/income/remove/${incomeId}`);
};