import { Pie, PieChart, Tooltip } from 'recharts';
import { formatMoney } from '../../utils';
import { Circle } from 'lucide-react';

type CustomPieChartProps = {
    data: {
        name: string
        value: number
        fill: string
    }[]
    caption?: {
        title: string
        description?: string
        maxItems?: number
    }
}

export function CustomPieChart(props: CustomPieChartProps) {
    props.data.sort((a, b) => b.value - a.value);

    const total = props.data.reduce((acc, data) => acc + data.value, 0);

    return (
        <div className="flex flex-col gap-4 items-center w-full h-full justify-between">
            <div className="flex flex-col items-center gap-4 w-full">
                {props.caption ?
                    <div className="flex justify-between w-full">
                        <div className="flex flex-col">
                            <span className="text-lg font-[700]">
                                {props.caption.title}
                            </span>
                            <span className="text-xs text-neutral-600">
                                {props.caption.description}
                            </span>
                        </div>
                    </div>
                    : null}

                <PieChart
                    style={{ width: '60%', height: '100%', maxWidth: '500px', maxHeight: '80vh', aspectRatio: 1 }}
                    responsive
                >
                    <Pie
                        data={props.data}
                        innerRadius="70%"
                        outerRadius="100%"
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: 10, padding: 12 }}
                        formatter={(value) => {
                            if (typeof value === "number") {
                                return formatMoney(String(value.toFixed(2)));
                            }

                            return value;
                        }}
                    />
                </PieChart>
            </div>

            {props.caption ?
                <div className="flex flex-col gap-2 w-full">
                    {
                        props.data.slice(0, props.caption.maxItems).map((entry, index) => (
                            <div key={`pie-${entry.name}-${index}`} className="flex justify-between items-center w-full">
                                <div className="flex gap-2 items-center">
                                    <Circle size={12} color={entry.fill} fill={entry.fill} />
                                    <span className="text-xs font-[300]">{entry.name}</span>
                                </div>

                                <span className="text-xs font-semibold">{formatMoney(String(entry.value.toFixed(2)))} ({(entry.value / total * 100).toFixed(2)}%)</span>
                            </div>
                        ))
                    }
                </div>
            : null}
        </div>
    );
}