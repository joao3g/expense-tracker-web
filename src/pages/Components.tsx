import { 
    ArrowDownRight,
    ArrowUpRight, 
    TriangleAlert, 
    CircleAlert, 
    Ticket,

    Plus,
    SlidersHorizontal
} from "lucide-react";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { Input } from "../components/Input";
import { CardSkeleton } from "../components/CardSkeleton";
import { ExpensesVsIncomesBarChart } from '../components/charts/BarChart';
import { CustomPieChart } from "../components/charts/PieChart";
import { BasicTable } from "../components/Table";
import { LoadingSkeleton } from "../components/LoadingSkeleton";

export default function Main() {
    return (
        <div className="flex flex-col gap-5 m-10">
            <div className="flex gap-3">
                <Icon size={20} />
            </div>

            <div className="flex gap-3">
                <Badge variant="success">
                    <div className="flex gap-2">
                        <ArrowUpRight size={16} />
                        8.1%
                    </div>
                </Badge>

                <Badge variant="danger">
                    <div className="flex gap-2">
                        <ArrowDownRight size={16} />
                        8.1%
                    </div>
                </Badge>

                <Badge variant="warning">
                    <div className="flex gap-2">
                        <TriangleAlert size={16} />
                        8.1%
                    </div>
                </Badge>

                <Badge variant="info">
                    <div className="flex gap-2">
                        <CircleAlert size={16} />
                        8.1%
                    </div>
                </Badge>

                <Badge variant="default">
                    <div className="flex gap-2">
                        <Ticket size={16} />
                        Vale alimentação
                    </div>
                </Badge>
            </div>

            <div className="flex gap-3">
                <Button variant="primary" onClick={() => console.log(".")}>
                    <div className="flex items-center gap-2">
                        <Plus size={20} strokeWidth={3} />
                        Adicionar despesa
                    </div>
                </Button>

                <Button variant="secondary" onClick={() => console.log(".")}>
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal size={16} />
                        Filtro
                    </div>
                </Button>
            </div>

            <div className="flex gap-3">
                <Input 
                    label="Email"
                    type="text"
                />
            </div>

            <div className="flex gap-3">
                <CardSkeleton>
                    <div className="h-30 w-100" />
                </CardSkeleton>

                <LoadingSkeleton />
            </div>

            <div className="flex gap-24 w-300">
                <div className="flex gap-3">
                    <ExpensesVsIncomesBarChart 
                        data={[
                            {
                                name: 'Fevereiro',
                                expense: 4700,
                                income: 6000
                            },
                            {
                                name: 'Março',
                                expense: 1700,
                                income: 3000
                            },
                            {
                                name: 'Abril',
                                expense: 5700,
                                income: 8000
                            },
                            {
                                name: 'Maio',
                                expense: 5200,
                                income: 4000
                            }
                        ]}
                        legend={{
                            title: "Entradas vs Despesas",
                            description: "Últimos 4 meses",
                            showChartLegend: true
                        }}
                    />
                </div>

                <div className="flex gap-3">
                    <CustomPieChart 
                        data={[
                            {
                                name: "Travel",
                                value: 412,
                                fill: "#796AE5"
                            },{
                                name: "Housing",
                                value: 1850,
                                fill: "#C37F00"
                            },{
                                name: "Food & Dining",
                                value: 228.90,
                                fill: "#009A4D"
                            },{
                                name: "Shopping",
                                value: 198.20,
                                fill: "#796AE5"
                            },{
                                name: "Transport",
                                value: 102.5,
                                fill: "#00B5B5"
                            }
                        ]}
                        caption={{
                            title: "Despesas por categoria",
                            description: "testando 123",
                            maxItems: 3
                        }}
                    />
                </div>
            </div>

            <div className="flex gap-24 w-300">
                <BasicTable 
                    caption={{ title: "Últimas transações", description: "Atividades recentes em sua(s) conta(s)" }}
                    data={[
                        {
                            color: "#009A4D",
                            value: 142.5,
                            title: "Whole Foods",
                            description: ["Alimentação", "21 de maio", "Débito"]
                        },{
                            color: "#00B5B5",
                            value: 38.2,
                            title: "Uber rides",
                            description: ["Transporte", "20 de maio", "Crédito"]
                        },{
                            color: "#009A4D",
                            value: 86.4,
                            title: "Dinner - Bottega",
                            description: ["Alimentação", "18 de maio", "Vale"]
                        },{
                            color: "#796AE5",
                            value: 120,
                            title: "Nike sneakers",
                            description: ["Compras", "17 de maio", "Crédito"]
                        },{
                            color: "#C282D0",
                            value: 32,
                            title: "Pharmacy",
                            description: ["Saúde", "14 de maio", "Débito"]
                        },{
                            color: "#F14D4C",
                            value: 28,
                            title: "Cinema",
                            description: ["Entretenimento", "11 de maio", "Crédito"]
                        }
                    ]}
                />
            </div>
        </div>
    );
}