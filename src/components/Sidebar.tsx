import { 
    ScanEye, 
    LayoutDashboard, 
    Rows2, 
    User,
    LogOut,
    BanknoteArrowDown,
    BanknoteArrowUp,
    Settings
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useRevalidator } from "react-router";
import { useState } from "react";
import { AddExpenseModal } from "./modals/AddExpenseModal";
import { Button } from "./Button";

function SidebarButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className="flex flex-row gap-x-3 px-4 py-4 text-white hover:bg-emerald-900 cursor-pointer rounded"
            {...props}
        >
            {props.children}
        </button>
    )
}

export function Sidebar() {
    const [expenseModalOpen, setExpenseModalOpen] = useState(false);

    const authContext = useAuth();
    const navigate = useNavigate();
    const { revalidate } = useRevalidator();

    function logout() {
        authContext.logout();
        navigate("/");
    }

    return (
        <>
            <AddExpenseModal 
                open={expenseModalOpen}
                onClose={() => {
                    setExpenseModalOpen(false);
                    revalidate();
                }}
            />
            <div
                className="flex flex-row justify-end items-center gap-6 px-8 h-20 w-full absolute text-gray text-lg bg-neutral-200 border-b-1 border-neutral-300"
            >
                <span className="font-semibold">{authContext.user?.name}</span>
                <User />
                <LogOut 
                    onClick={logout}
                    className="cursor-pointer"
                />
            </div>
            <nav
                className="fixed flex flex-col justify-between items-center w-90 min-h-screen bg-linear-to-t from-emerald-900 to-emerald-800 pb-10"
            >
                <div className="w-full">
                    <div
                        className="flex justify-center items-center bg-emerald-900 px-8 h-20"
                    >
                        <ScanEye color="white" className="mr-3" size={40}/>
                        <span className="text-white text-2xl font-bold">
                            Expense Tracker
                        </span>
                    </div>
                    <div
                        className="border-b-2 border-emerald-900 bg-emerald-800 flex flex-col font-semibold py-4 px-8 gap-2"
                    >
                        <SidebarButton onClick={() => navigate("/dashboard")}>
                            <LayoutDashboard />
                            Dashboard
                        </SidebarButton>

                        <SidebarButton onClick={() => navigate("/incomes")}>
                            <BanknoteArrowUp />
                            Entradas
                        </SidebarButton>

                        <SidebarButton onClick={() => navigate("/expenses")}>
                            <BanknoteArrowDown />
                            Despesas
                        </SidebarButton>

                        <SidebarButton onClick={() => navigate("/categories")}>
                            <Rows2 />
                            Categorias
                        </SidebarButton>

                        <SidebarButton onClick={() => navigate("/categories")}>
                            <Settings />
                            Configurações
                        </SidebarButton>
                    </div>
                </div>
                <Button
                    color="emerald"
                    onClick={() => setExpenseModalOpen(true)}
                >
                    Adicionar despesa
                </Button>
            </nav>
        </>
    )
}