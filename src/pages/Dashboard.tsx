import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ptBR } from '@mui/x-date-pickers/locales';
import { useLoaderData } from "react-router";
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import PieChart from '../components/charts/PieChart';
import BarChart from '../components/charts/BarChart';
import type { Expense, ExpenseSummarized, ExpenseTotal } from '../api/types/expense';
import type { Income, IncomeTotal } from '../api/types/income';
import * as expenseService from '../api/services/expense.service';
import * as incomeService from '../api/services/income.service';
import type { PieValueType } from '@mui/x-charts';
import { getMonthOffset } from '../utils';

function getExpenseTableData(expenses: Expense[]) {
    const expenseMap = {
        "CREDIT": "Crédito",
        "DEBIT": "Débito",
        "VOUCHER": "Vale"
    }

    return expenses.slice(0, 5).map(expense => {
        return [
            expense.title,
            expense.description || "Sem descrição",
            Number(expense.amount).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
            expenseMap[expense.paymentMethod],
            expense.category.title
        ]
    });
}

function getExpensesByCategoryPieData(expensesSummarized: ExpenseSummarized) {
    return expensesSummarized.summarizedByCategory.map(item => {
        return {
            value: Number(item._sum.amount),
            color: "#" + item.categoryColor,
            label: item.categoryTitle
        }
    });
}

function getIncomesVsExpensesBarChartData(startDate: Date, expensesTotal: ExpenseTotal[], incomesTotal: IncomeTotal[]) {
    if (expensesTotal.length !== incomesTotal.length) throw "expensesTotal and incomesTotal need to have the same size!";

    const labels = [];
    for (let index = 0; index < incomesTotal.length; index++) {
        labels.push(startDate.toLocaleDateString("pt-BR", { month: "long" }).toUpperCase());
        startDate.setMonth(startDate.getMonth() + 1);
    }

    return {
        labels,
        incomeData: incomesTotal.map(item => Number(item._sum.amount)),
        expenseData: expensesTotal.map(item => Number(item._sum.amount))
    };
}

function getLastMonthRelationData(expensesTotal: ExpenseTotal[], incomesTotal: IncomeTotal[]) {
    if (expensesTotal.length < 2 || incomesTotal.length < 2) throw "incomesTotal and expensesTotal has to have size greater than 1";

    const currentMonthBalance = Number(incomesTotal[0]._sum.amount) - Number(expensesTotal[0]._sum.amount);
    const lastMonthBalance = Number(incomesTotal[1]._sum.amount) - Number(expensesTotal[1]._sum.amount);

    if (currentMonthBalance === 0 || lastMonthBalance === 0) return "+ 0%";
    
    const relation = (currentMonthBalance - lastMonthBalance) * 100 / lastMonthBalance;
    return relation >= 0 ? `+ ${relation}%` : `- ${relation}%`;
}

export default function Main() {
    const data = useLoaderData<{
        expenses: Expense[],
        incomes: Income[],
        expensesSummarized: ExpenseSummarized,
        expensesTotal: ExpenseTotal[],
        incomesTotal: IncomeTotal[]
    }>();

    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs(new Date()));
    const [tableData, setTableData] = useState<string[][]>(getExpenseTableData(data.expenses));
    const [expensesByCategoryPieData, setExpensesByCategoryPieData] = useState<PieValueType[]>(getExpensesByCategoryPieData(data.expensesSummarized));
    const [incomesVsExpensesBarChartData, setIncomesVsExpensesBarChartData] = useState<{ labels: string[], incomeData: number[], expenseData: number[] }>(getIncomesVsExpensesBarChartData(new Date(), data.expensesTotal, data.incomesTotal));
    const [incomeTotal, setIncomeTotal] = useState(data.incomes.reduce((acc, current) => acc += Number(current.amount), 0));
    const [expenseTotal, setExpenseTotal] = useState(data.expenses.reduce((acc, current) => acc += Number(current.amount), 0));
    const [lastMonthRelation, setLastMonthRelation] = useState(getLastMonthRelationData(data.expensesTotal, data.incomesTotal));

    useEffect(() => {
        const updateExpenses = async () => {
            try {
                if (selectedDate) {
                    const expenses = await expenseService.getExpensesByMonth(selectedDate.toDate());
                    const expensesSummarized = await expenseService.getExpensesSummarizedByMonth(selectedDate.toDate());

                    setTableData(getExpenseTableData(expenses));
                    setExpensesByCategoryPieData(getExpensesByCategoryPieData(expensesSummarized));
                    setExpenseTotal(expenses.reduce((acc, current) => acc += Number(current.amount), 0));
                }
            } catch (e) {
            }
        }

        const updateIncomes = async () => {
            try {
                if (selectedDate) {
                    const incomes = await incomeService.getIncomesByMonth(selectedDate.toDate());

                    setIncomeTotal(incomes.reduce((acc, current) => acc += Number(current.amount), 0));
                }
            } catch (e) {
            }
        }

        const updateBarChart = async () => {
            try {
                if (selectedDate) {
                    const [incomesTotal, expensesTotal] = await Promise.all([
                        [
                            await incomeService.getIncomesTotalByMonth(selectedDate.toDate()),
                            await incomeService.getIncomesTotalByMonth(getMonthOffset(selectedDate.toDate(), 1)),
                            await incomeService.getIncomesTotalByMonth(getMonthOffset(selectedDate.toDate(), 2)),
                            await incomeService.getIncomesTotalByMonth(getMonthOffset(selectedDate.toDate(), 3)),
                        ],
                        [
                            await expenseService.getExpensesTotalByMonth(selectedDate.toDate()),
                            await expenseService.getExpensesTotalByMonth(getMonthOffset(selectedDate.toDate(), 1)),
                            await expenseService.getExpensesTotalByMonth(getMonthOffset(selectedDate.toDate(), 2)),
                            await expenseService.getExpensesTotalByMonth(getMonthOffset(selectedDate.toDate(), 3)),
                        ]
                    ]);

                    setLastMonthRelation(getLastMonthRelationData(expensesTotal, incomesTotal));
                    setIncomesVsExpensesBarChartData(getIncomesVsExpensesBarChartData(selectedDate.toDate(), expensesTotal, incomesTotal));
                }
            } catch (e) {

            }
        }

        updateIncomes();
        updateExpenses();
        updateBarChart();
    }, [selectedDate]);

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full flex justify-end mb-4">
                <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale='pt'
                    localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText}
                >
                    <DatePicker
                        views={['month', 'year']}
                        value={selectedDate}
                        onChange={(value) => setSelectedDate(value)}
                    />
                </LocalizationProvider>
            </div>
            <div
                className="grid grid-cols-6 gap-6 w-full"
            >
                <div className="col-span-2">
                    <Card
                        title="Entradas"
                        metric={`+ ${incomeTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`}
                        description="Entradas neste mês"
                        bgColor="green"
                    />
                </div>

                <div className="col-span-2">
                    <Card
                        title="Saídas"
                        metric={`- ${expenseTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`}
                        description="Saídas neste mês"
                        bgColor="red"
                    />
                </div>

                <div className="col-span-2">
                    <Card
                        title="Balanço"
                        metric={`${(incomeTotal - expenseTotal).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`}
                        description={`${lastMonthRelation} em relação ao mês anterior`}
                        bgColor="teal"
                    />
                </div>

                <div className="col-span-4">
                    <div className="flex flex-col gap-6 justify-center items-center rounded-2xl bg-white border-1 border-neutral-100">
                        <div className="w-full bg-neutral-100 rounded-t-2xl py-4 flex pl-10 items-center border-b-1 border-neutral-100">
                            <h2 className="text-2xl font-semibold">Últimas despesas</h2>
                        </div>
                        {
                            tableData.length ?
                                <Table
                                    header={["Título", "Descrição", "Valor", "Forma de Pagamento", "Categoria"]}
                                    rows={tableData}
                                /> :
                                <span className="mb-4 text-xl italic">Não há dados para o período selecionado</span>

                        }
                    </div>
                </div>

                <div className="col-span-2">
                    <div className="flex flex-col justify-center items-center rounded-2xl bg-white border-1 border-neutral-100">
                        <div className="w-full bg-neutral-100 rounded-t-2xl py-4 flex pl-10 items-center border-b-1 border-neutral-100">
                            <h2 className="text-2xl font-semibold">Gastos por categoria</h2>
                        </div>
                        <div className="flex items-center justify-center w-full px-8 py-4">
                            <PieChart
                                data={expensesByCategoryPieData}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-span-6">
                    <div className="flex flex-col justify-center items-center rounded-2xl bg-white border-1 border-neutral-100">
                        <div className="flex justify-between w-full bg-neutral-100 rounded-t-2xl py-4 flex px-10 items-center border-b-1 border-neutral-100">
                            <h2 className="text-2xl font-semibold">Entradas x Saídas</h2>
                            <h2 className="text-md font-semibold text-gray-600 italic">Últimos 4 meses</h2>
                        </div>
                        <div className="flex items-center justify-center w-full px-8 py-4">
                            <BarChart
                                xAxis={[{ data: incomesVsExpensesBarChartData.labels }]}
                                series={[
                                    {
                                        data: incomesVsExpensesBarChartData.incomeData,
                                        color: "#10b981",
                                        valueFormatter: (value) =>
                                            value ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value) : null
                                    },
                                    {
                                        data: incomesVsExpensesBarChartData.expenseData,
                                        color: "#ef4444",
                                        valueFormatter: (value) =>
                                            value ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value) : null
                                    }
                                ]}
                                height={400}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}