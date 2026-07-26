import * as incomeService from "../api/services/income.service";
import { getMonthAndYearString } from "../utils";

export const incomesByMonthQuery = (date: Date) => ({
    queryKey: ['incomes', getMonthAndYearString(date)],
    queryFn: async () => incomeService.getIncomesByMonth(date),
});