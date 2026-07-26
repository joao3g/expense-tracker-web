import * as expenseService from "../api/services/expense.service";
import { getMonthAndYearString } from "../utils";

export const expensesByMonthQuery = (date: Date) => ({
    queryKey: ['expenses', getMonthAndYearString(date)],
    queryFn: async () => expenseService.getExpensesByMonth(date),
});

export const expensesSummarizedByMonthQuery = (date: Date) => ({
    queryKey: ['expensesSummarized', getMonthAndYearString(date)],
    queryFn: async () => expenseService.getExpensesSummarizedByMonth(date),
});