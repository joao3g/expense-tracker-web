import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { formatMoney } from '../../utils';
import { Circle } from 'lucide-react';

type ExpensesVsIncomesBarChartProps = {
    data: {
        name: string
        expense: number
        income: number
    }[],
    legend?: {
        title: string
        description?: string
        showChartLegend: boolean
    }
}

export function ExpensesVsIncomesBarChart(props: ExpensesVsIncomesBarChartProps) {
    const expenseColor = "#DE2A32";
    const incomeColor = "#009A4D";

    const mappedLegend: Record<string, string> = {
        expense: "Despesa",
        income: "Entrada"
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            {props.legend ?
                <div className="flex justify-between">
                    <div className="flex flex-col">
                        <span className="text-xl font-[600]">
                            {props.legend.title}
                        </span>
                        <span className="text-xs text-neutral-600">
                            {props.legend.description}
                        </span>
                    </div>

                    <div className="flex gap-3">
                        <div className="flex gap-2 items-center">
                            <Circle size={12} color={incomeColor} fill={incomeColor} />
                            <span className="text-sm font-[300]">Entradas</span>
                        </div>

                        <div className="flex gap-2 items-center">
                            <Circle size={12} color={expenseColor} fill={expenseColor} />
                            <span className="text-sm font-[300]">Despesas</span>
                        </div>
                    </div>
                </div>
                : null}

            <BarChart
                style={{ width: "100%", maxHeight: '70vh', aspectRatio: 2 }}
                responsive
                data={props.data}
                barGap={24}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tickSize={12}
                    tick={{ fontSize: 12 }}
                />
                <YAxis
                    width="auto"
                    domain={[0, "dataMax + 2000"]}
                    tickFormatter={(value) => `R$${value / 1000}k`}
                    axisLine={false}
                    tickLine={false}
                    tickSize={12}
                    tick={{ fontSize: 12 }}
                />
                <Tooltip
                    contentStyle={{ borderRadius: 10, padding: 12 }}
                    formatter={(value, name) => {
                        if (typeof value === "number" && typeof name === "string") {
                            return [formatMoney(String(value * 100)), mappedLegend[name]];
                        }

                        return [value, name] as [any, any];
                    }}
                />
                <Bar dataKey="expense" legendType="circle" fill={expenseColor} barSize={36} radius={[10, 10, 0, 0]} />
                <Bar dataKey="income" legendType="circle" fill={incomeColor} barSize={36} radius={[10, 10, 0, 0]} />
                {/* <RechartsDevtools /> */}
            </BarChart>
        </div>
    );
};