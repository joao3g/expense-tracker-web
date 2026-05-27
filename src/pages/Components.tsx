import { 
    ArrowDownRight,
    ArrowUpRight, 
    TriangleAlert, 
    CircleAlert, 
    Ticket,

    Plus,
    SlidersHorizontal,
    Settings
} from "lucide-react";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { Input } from "../components/Input";

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

                <Button variant="menu" disabled onClick={() => console.log(".")}>
                    <div className="flex items-center gap-2">
                        <Settings size={16} />
                        Configurações
                    </div>
                </Button>
            </div>

            <div className="flex gap-3">
                <Input 
                    label="Email"
                    type="text"
                />
            </div>
        </div>
    );
}