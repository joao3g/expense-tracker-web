import { type DefaultizedPieValueType, type PieValueType } from '@mui/x-charts/models';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';


export default function Main({ data }: { data: PieValueType[] }) {
    const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);
    
    const getArcLabel = (params: DefaultizedPieValueType) => {
        const percent = params.value / TOTAL;
        return `${(percent * 100).toFixed(0)}%`;
    };

    return (
        <PieChart
            // className="bg-blue-900"
            height={200}
            series={[
                {
                    outerRadius: 100,
                    data,
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
