import { Pie, PieChart, Tooltip } from 'recharts';
import { formatMoney } from '../../utils';
import { Circle } from 'lucide-react';

type CustomPieChartProps = {
    data: {
        name: string
        value: number
        fill: string
    }[]
    legend?: {
        title: string
        description?: string
        maxItems?: number
    }
}

export function CustomPieChart(props: CustomPieChartProps) {
    props.data.sort((a, b) => b.value - a.value);

    return (
        <div className="flex flex-col gap-4 items-center w-full">
            {props.legend ?
                <div className="flex justify-between w-full">
                    <div className="flex flex-col">
                        <span className="text-xl font-[600]">
                            {props.legend.title}
                        </span>
                        <span className="text-xs text-neutral-600">
                            {props.legend.description}
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
                            return formatMoney(String(value * 100));
                        }

                        return value;
                    }}
                />
            </PieChart>

            {props.legend ?
                <div className="flex flex-col gap-2 w-full">
                    {
                        props.data.slice(0, props.legend.maxItems).map((entry, index) => (
                            <div key={`pie-${entry.name}-${index}`} className="flex justify-between items-center w-full">
                                <div className="flex gap-2 items-center">
                                    <Circle size={12} color={entry.fill} fill={entry.fill} />
                                    <span className="text-xs font-[300]">{entry.name}</span>
                                </div>

                                <span className="text-xs font-semibold">{formatMoney(String(entry.value * 100))}</span>
                            </div>
                        ))
                    }
                </div>
            : null}
        </div>
    );
}