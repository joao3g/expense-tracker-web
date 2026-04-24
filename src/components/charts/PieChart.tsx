import { type DefaultizedPieValueType, type PieValueType } from '@mui/x-charts/models';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

export default function Main({ data, collapse }: { data: PieValueType[], collapse?: boolean }) {
    const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

    if (collapse) {
        const others = { 
            value: data.reduce((acc, item) => {
                const percent = (item.value / TOTAL) * 100;
                if (percent <= 10) return acc + item.value;
                return acc;
            }, 0),
            label: "Outros"
        }

        data = data.filter(item => {
            const percent = (item.value / TOTAL) * 100;
            if (percent <= 10) return false;
            return true;
        });

        data.push(others);
    }

    const getArcLabel = (params: DefaultizedPieValueType) => {
        const percent = (params.value / TOTAL) * 100;
        return percent > 5 ? `${percent.toFixed(0)}%` : "";
    };

    return (
        <PieChart
            // className="bg-blue-900"
            height={200}
            series={[
                {
                    outerRadius: 100,
                    data: data,
                    arcLabel: getArcLabel,
                    valueFormatter: (param) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(param.value)
                },
            ]}
            sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                    fill: 'white',
                    fontSize: 14,
                },
            }}
        />
    );
}
