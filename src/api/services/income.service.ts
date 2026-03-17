import { api } from "./client";
import type { Income, IncomeTotal } from "../types/income";

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