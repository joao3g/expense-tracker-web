import { useState } from 'react';
import { useLoaderData, useSearchParams } from "react-router";
import { CardSkeleton } from '../components/CardSkeleton';
import { ExpensesVsIncomesBarChart } from '../components/charts/BarChart';
import type { Expense, ExpenseSummarized, ExpenseTotal } from '../api/types/expense';
import type { Income, IncomeTotal } from '../api/types/income';
import { formatMoney, getMonthOffset, PAYMENT_METHOD_MAP, PAYMENT_METHOD_TO_COLOR_MAP } from '../utils';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { ArrowDownRight, ArrowUpRight, CalendarOff, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { CustomPieChart } from '../components/charts/PieChart';
import { Button } from '../components/Button';
import { BasicTable } from '../components/Table';
import { useDate } from '../hooks/useDate';
import { useQueries, useQuery } from '@tanstack/react-query';
import { expensesByMonthQuery, expensesSummarizedByMonthQuery } from '../queries/expenses';
import { incomesByMonthQuery } from '../queries/incomes';

function getExpenseTableData(expenses: Expense[] | undefined) {
    return expenses
        ?.sort((a: Expense, b: Expense) => (new Date(b.createdAt)).getTime() - (new Date(a.createdAt)).getTime())
        .slice(0, 6)
        .map(expense => {
            return {
                title: expense.title,
                color: `#${expense.category.color}`,
                description: [
                    expense.category.title,
                    (new Date(expense.transactionDate)).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
                    PAYMENT_METHOD_MAP[expense.paymentMethod]
                ],
                value: Number(expense.amount)
            }
        });
}

function getExpensesByCategoryPieData(expensesSummarized: ExpenseSummarized | undefined) {
    const data: {
        value: number,
        fill: string,
        name: string
    }[] = [];

    expensesSummarized?.summarizedByCategory.forEach(item => {
        data.push({
            value: Number(item._sum.amount),
            fill: "#" + item.categoryColor,
            name: item.categoryTitle
        });
    });

    return data;
}

function getExpensesByTitlePieData(expensesSummarized: ExpenseSummarized | undefined) {
    return expensesSummarized?.summarizedByTitle.map(item => {
        return {
            value: Number(item._sum.amount),
            fill: "#333333",
            name: item.title
        }
    });
}

function getExpensesByPaymentMethodPieData(expensesSummarized: ExpenseSummarized | undefined) {
    return expensesSummarized?.summarizedByPaymentMethod.map(item => {
        return {
            value: Number(item._sum.amount),
            fill: "#" + PAYMENT_METHOD_TO_COLOR_MAP[item.paymentMethod],
            name: PAYMENT_METHOD_MAP[item.paymentMethod]
        }
    });
}

function getIncomesVsExpensesBarChartData(startDate: Date, expensesTotal: number[], incomesTotal: number[]) {
    startDate.setMonth(startDate.getMonth() - 2);

    if (expensesTotal.length !== incomesTotal.length) throw "expensesTotal and incomesTotal need to have the same size!";

    const data = [];
    for (let index = 0; index < incomesTotal.length; index++) {
        data.push({
            name: startDate.toLocaleDateString("pt-BR", { month: "long" })[0].toUpperCase() + startDate.toLocaleDateString("pt-BR", { month: "long" }).slice(1),
            expense: expensesTotal[index],
            income: incomesTotal[index]
        });

        startDate = getMonthOffset(startDate, +1);
    }

    return data;
}

function getLastMonthRelationData(expensesTotal: number[], incomesTotal: number[]) {
    if (expensesTotal.length < 2 || incomesTotal.length < 2) throw "incomesTotal and expensesTotal has to have size greater than 1";

    const currentMonthBalance = incomesTotal[0] - expensesTotal[0];
    const lastMonthBalance = incomesTotal[1] - expensesTotal[1];

    if (currentMonthBalance === 0 || lastMonthBalance === 0) return "+ 0%";

    const relation = Math.floor((currentMonthBalance - Math.abs(lastMonthBalance)) * 100 / lastMonthBalance);
    return relation >= 0 ? `+ ${Math.abs(relation)}%` : `- ${Math.abs(relation)}%`;
}

export default function Main() {
    const authContext = useAuth();

    const { currentDate } = useDate();

    const expensesSummarizedQuery = useQuery(expensesSummarizedByMonthQuery(currentDate));
    const expensesQueries = useQueries({
        queries: [
            expensesByMonthQuery(getMonthOffset(currentDate, -2)),
            expensesByMonthQuery(getMonthOffset(currentDate, -1)),
            expensesByMonthQuery(currentDate),
            expensesByMonthQuery(getMonthOffset(currentDate, 1)),
            expensesByMonthQuery(getMonthOffset(currentDate, 2))
        ]
    });
    const incomesQueries = useQueries({
        queries: [
            incomesByMonthQuery(getMonthOffset(currentDate, -2)),
            incomesByMonthQuery(getMonthOffset(currentDate, -1)),
            incomesByMonthQuery(currentDate),
            incomesByMonthQuery(getMonthOffset(currentDate, 1)),
            incomesByMonthQuery(getMonthOffset(currentDate, 2))
        ]
    });

    const data = {
        incomes: incomesQueries[2].data,
        incomesTotal: incomesQueries.map(query => {
            const incomes = query.data;

            if (incomes) return incomes.reduce((acc, income) => acc + Number(income.amount), 0);
            return 0;
        }),
        expenses: expensesQueries[2].data,
        expensesTotal: expensesQueries.map(query => {
            const expenses = query.data;

            if (expenses) return expenses.reduce((acc, expense) => acc + Number(expense.amount), 0);
            return 0;
        }),
        expensesSummarized: expensesSummarizedQuery.data
    }

    const incomeTotal = data.incomesTotal[2];
    const expenseTotal = data.expensesTotal[2];

    const lastMonthRelation = getLastMonthRelationData(data.expensesTotal, data.incomesTotal);
    const tableData = getExpenseTableData(data.expenses);
    const expensesByCategoryPieData = getExpensesByCategoryPieData(data.expensesSummarized);
    const expensesByPaymentMethod = getExpensesByPaymentMethodPieData(data.expensesSummarized);
    const expensesByPaymentMethodPieData = getExpensesByPaymentMethodPieData(data.expensesSummarized);
    const incomesVsExpensesBarChartData = getIncomesVsExpensesBarChartData(new Date(currentDate), data.expensesTotal, data.incomesTotal);

    function handleGreeting() {
        const now = new Date();

        if (now.getHours() < 12) return "Bom dia";
        if (now.getHours() < 18) return "Boa tarde";
        return "Boa noite";
    }

    function getPercentageBetweenValues(a: number, b: number) {
        const diff = Math.abs(a - b);
        const percent = (diff * 100 / Math.abs(a)).toFixed(2);

        return `${percent}%`;
    }

    function renderBadge(number1: number, number2: number, reverseLogic?: boolean) {
        const percentage = getPercentageBetweenValues(number1, number2);
        const isPositive = number1 > number2 ? false : true;

        if (isPositive) {
            return (
                <Badge variant={reverseLogic ? "danger" : "success"}>
                    <div className="flex gap-2">
                        <ArrowUpRight size={16} />
                        <span>
                            {percentage}
                        </span>
                    </div>
                </Badge>
            );
        }

        return (
            <Badge variant={reverseLogic ? "success" : "danger"}>
                <div className="flex gap-2">
                    <ArrowDownRight size={16} />
                    <span>
                        {percentage}
                    </span>
                </div>
            </Badge>
        );
    }

    function getBalance(income: number, expense: number) {
        const isPositive = income >= expense ? true : false;
        const formatted = formatMoney(String((incomeTotal - expenseTotal).toFixed(2)));

        return isPositive ? formatted : `-${formatted}`;
    }

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full flex justify-between items-end mb-4">
                <div className="flex flex-col">
                    <span className="text-3xl font-[600]">
                        {`${handleGreeting()}, ${authContext.user?.name?.split(" ")[0]}`}
                    </span>
                    <span className="text-sm/6 text-neutral-600">
                        {`Este é o seu retrato financeiro em ${currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}.`}
                    </span>
                </div>

                <div className="flex gap-2">
                    <div className="w-[180px]">
                        <Button variant="secondary" onClick={() => console.log("Função não implementada")} >Exportar relatório</Button>
                    </div>
                </div>
            </div>
            <div
                className="grid grid-cols-6 gap-6 w-full"
            >
                {
                    data.incomes?.length || data.expenses?.length ?
                        <>
                            <div className="col-span-2">
                                <CardSkeleton>
                                    <div className="flex justify-between items-center">
                                        <div className="bg-green-100 size-10 rounded-full flex justify-center items-center">
                                            <TrendingUp size={20} className="text-green-900" />
                                        </div>

                                        {renderBadge(data.incomesTotal[1], data.incomesTotal[2])}
                                    </div>

                                    <div className="flex flex-col justify-between items-start mt-6">
                                        <span className="text-xs font-[300]">Entradas somadas</span>
                                        <span className="text-3xl font-[600]">{formatMoney(String(incomeTotal.toFixed(2)))}</span>
                                    </div>
                                </CardSkeleton>
                            </div>

                            <div className="col-span-2">
                                <CardSkeleton>
                                    <div className="flex justify-between items-center">
                                        <div className="bg-red-100 size-10 rounded-full flex justify-center items-center">
                                            <TrendingDown size={20} className="text-red-900" />
                                        </div>

                                        {renderBadge(data.expensesTotal[1], data.expensesTotal[2], true)}
                                    </div>

                                    <div className="flex flex-col justify-between items-start mt-6">
                                        <span className="text-xs font-[300]">Despesas somadas</span>
                                        <span className="text-3xl font-[600]">{formatMoney(String(expenseTotal.toFixed(2)))}</span>
                                    </div>
                                </CardSkeleton>
                            </div>

                            <div className="col-span-2">
                                <CardSkeleton>
                                    <div className="flex justify-between items-center">
                                        <div className="bg-teal-100 size-10 rounded-full flex justify-center items-center">
                                            <Wallet size={20} className="text-teal-900" />
                                        </div>

                                        {renderBadge(
                                            data.incomesTotal[1] - data.expensesTotal[1],
                                            data.incomesTotal[2] - data.expensesTotal[2]
                                        )}
                                    </div>

                                    <div className="flex flex-col justify-between items-start mt-6">
                                        <span className="text-xs font-[300]">Balanço mensal</span>
                                        <span className="text-3xl font-[600]">{getBalance(incomeTotal, expenseTotal)}</span>
                                    </div>
                                </CardSkeleton>
                            </div>

                            <div className="col-span-4">
                                <CardSkeleton>
                                    <ExpensesVsIncomesBarChart
                                        data={incomesVsExpensesBarChartData}
                                        legend={{
                                            title: "Entradas vs Despesas",
                                            description: `De ${incomesVsExpensesBarChartData[0].name} a ${incomesVsExpensesBarChartData[incomesVsExpensesBarChartData.length - 1].name}`,
                                            showChartLegend: true
                                        }}
                                        aspectRatio={2.5}
                                        barGap={8}
                                    />
                                </CardSkeleton>
                            </div>

                            <div className="col-span-2">
                                <CardSkeleton>
                                    <CustomPieChart
                                        data={expensesByCategoryPieData}
                                        caption={{
                                            title: "Despesas por categoria",
                                            description: `Mês de ${currentDate.toLocaleDateString("pt-BR", { month: "long" })}`,
                                            maxItems: 4
                                        }}
                                    />
                                </CardSkeleton>
                            </div>

                            <div className="col-span-4">
                                <CardSkeleton padding={{ left: 0, right: 0 }}>
                                    {tableData ? 
                                        <BasicTable
                                            caption={{ title: "Últimas transações", description: "Atividades recentes em sua(s) conta(s)" }}
                                            data={tableData}
                                        />
                                    : null
                                    }
                                </CardSkeleton>
                            </div>

                            <div className="col-span-2">
                                <CardSkeleton>
                                    {expensesByPaymentMethod ? 
                                        <CustomPieChart
                                            data={expensesByPaymentMethod}
                                            caption={{
                                                title: "Despesas por forma de pagamento",
                                                description: `Mês de ${currentDate.toLocaleDateString("pt-BR", { month: "long" })}`,
                                                maxItems: 5
                                            }}
                                        />
                                    : null
                                    }
                                </CardSkeleton>
                            </div>
                        </>
                        :

                        <div className="col-span-6">
                            <CardSkeleton>
                                <div className="flex flex-col gap-4 justify-center items-center py-12">
                                    <div className="flex items-center justify-center size-16 bg-neutral-100/60 rounded-full text-neutral-500">
                                        <CalendarOff size={24} />
                                    </div>

                                    <span className="text-lg font-[600]">{`Nenhum registro em ${currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}`}</span>

                                    <span className="text-sm text-center w-2/5">Nenhum entrada ou despesa foram encontradas no período selecionado. Navegue para outro mês usando o seletor na barra lateral, ou adicione uma nova entrada para começar a mapear.</span>
                                </div>
                            </CardSkeleton>
                        </div>
                }
            </div>
        </div>
    )
}