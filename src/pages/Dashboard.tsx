import { useState } from 'react';
import { useLoaderData, useSearchParams } from "react-router";
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import PieChart from '../components/charts/PieChart';
import BarChart from '../components/charts/BarChart';
import type { Expense, ExpenseSummarized, ExpenseTotal } from '../api/types/expense';
import type { Income, IncomeTotal } from '../api/types/income';
import { getMonthOffset } from '../utils';
import { Input } from '../components/Input';

const PAYMENT_METHOD_MAP = {
    "CREDIT": "Crédito",
    "DEBIT": "Débito",
    "VOUCHER": "Vale"
}

function getExpenseTableData(expenses: Expense[]) {
    return expenses
        .sort((a: Expense, b: Expense) => (new Date(b.createdAt)).getTime() - (new Date(a.createdAt)).getTime())
        .slice(0, 5)
        .map(expense => {
            return [
                expense.title,
                expense.description || "Sem descrição",
                Number(expense.amount),
                PAYMENT_METHOD_MAP[expense.paymentMethod],
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

function getExpensesByTitlePieData(expensesSummarized: ExpenseSummarized) {
    return expensesSummarized.summarizedByTitle.map(item => {
        return {
            value: Number(item._sum.amount),
            // color: "#" + item.categoryColor,
            label: item.title
        }
    });
}

function getExpensesByPaymentMethodPieData(expensesSummarized: ExpenseSummarized) {
    return expensesSummarized.summarizedByPaymentMethod.map(item => {
        return {
            value: Number(item._sum.amount),
            // color: "#" + item.categoryColor,
            label: PAYMENT_METHOD_MAP[item.paymentMethod]
        }
    });
}

function getIncomesVsExpensesBarChartData(startDate: Date, expensesTotal: ExpenseTotal[], incomesTotal: IncomeTotal[]) {
    if (expensesTotal.length !== incomesTotal.length) throw "expensesTotal and incomesTotal need to have the same size!";

    const labels = [];
    for (let index = 0; index < incomesTotal.length; index++) {
        labels.push(startDate.toLocaleDateString("pt-BR", { month: "long" }).toUpperCase());
        startDate = getMonthOffset(startDate, -1);
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
    
    const relation = Math.floor((currentMonthBalance - Math.abs(lastMonthBalance)) * 100 / lastMonthBalance);
    return relation >= 0 ? `+ ${Math.abs(relation)}%` : `- ${Math.abs(relation)}%`;
}

export default function Main() {
    const data = useLoaderData<{
        expenses: Expense[],
        incomes: Income[],
        expensesSummarized: ExpenseSummarized,
        expensesTotal: ExpenseTotal[],
        incomesTotal: IncomeTotal[]
    }>();
    
    const [searchParams, setSearchParams] = useSearchParams();

    const [selectedDate, setSelectedDate] = useState<Date>(initiateSelectedDate());

    const tableData = getExpenseTableData(data.expenses);
    const expensesByCategoryPieData = getExpensesByCategoryPieData(data.expensesSummarized);
    const expensesByTitlePieData = getExpensesByTitlePieData(data.expensesSummarized);
    const expensesByPaymentMethodPieData = getExpensesByPaymentMethodPieData(data.expensesSummarized);
    const incomesVsExpensesBarChartData = getIncomesVsExpensesBarChartData(new Date(selectedDate), data.expensesTotal, data.incomesTotal);
    const incomeTotal = data.incomes.reduce((acc, current) => acc += Number(current.amount), 0);
    const expenseTotal = data.expenses.reduce((acc, current) => acc += Number(current.amount), 0);
    const lastMonthRelation = getLastMonthRelationData(data.expensesTotal, data.incomesTotal);

    function handleDateChange(date: Date) {
        const formatted = date.toLocaleDateString("en-CA");

        setSearchParams({ date: formatted });
    }

    function initiateSelectedDate() {
        const dateParam = searchParams.get("date"); 
        
        return dateParam ? new Date(`${dateParam}T00:00`) : new Date();
    }

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full flex justify-end mb-4">
                <div className="w-3xs">
                    <Input 
                        type="date"
                        label="Mês vigente"
                        value={selectedDate.toLocaleDateString("en-CA")}
                        onChange={(e) => { 
                            const date = new Date(e.target.value + "T00:00:00");
                            setSelectedDate(date);
                            handleDateChange(date); 
                        }}
                    />
                </div>
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

                <div className="col-span-6">
                    <div className="flex flex-col gap-6 justify-center items-center rounded-2xl bg-white border-1 border-neutral-100">
                        <div className="w-full bg-neutral-100 rounded-t-2xl py-4 flex pl-10 items-center border-b-1 border-neutral-100">
                            <h2 className="text-2xl font-semibold">Últimas saídas</h2>
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

                <div className="col-span-2">
                    <div className="flex flex-col justify-center items-center rounded-2xl bg-white border-1 border-neutral-100">
                        <div className="w-full bg-neutral-100 rounded-t-2xl py-4 flex pl-10 items-center border-b-1 border-neutral-100">
                            <h2 className="text-2xl font-semibold">Gastos por título</h2>
                        </div>
                        <div className="flex items-center justify-center w-full px-8 py-4">
                            <PieChart
                                data={expensesByTitlePieData}
                                collapse
                            />
                        </div>
                    </div>
                </div>

                <div className="col-span-2">
                    <div className="flex flex-col justify-center items-center rounded-2xl bg-white border-1 border-neutral-100">
                        <div className="w-full bg-neutral-100 rounded-t-2xl py-4 flex pl-10 items-center border-b-1 border-neutral-100">
                            <h2 className="text-2xl font-semibold">Gastos por forma de pagamento</h2>
                        </div>
                        <div className="flex items-center justify-center w-full px-8 py-4">
                            <PieChart
                                data={expensesByPaymentMethodPieData}
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