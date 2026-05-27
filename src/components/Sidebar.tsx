import {
    LayoutDashboard,
    Rows2,
    User,
    LogOut,
    BanknoteArrowDown,
    BanknoteArrowUp,
    Settings,
    Plus,
    Users
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useRevalidator } from "react-router";
import { useState } from "react";
import { AddExpenseModal } from "./modals/AddExpenseModal";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Badge } from "./Badge";

function SidebarButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className="px-4 py-2 text-neutral-600 font-[400] bg-transparent hover:text-black hover:bg-neutral-100/70 disabled:bg-green-900/10 disabled:text-emerald-900 rounded-full cursor-pointer w-full"
            {...props}
        >
            {props.children}
        </button>
    )
}

export function Sidebar() {
    const [expenseModalOpen, setExpenseModalOpen] = useState(false);
    const [settingsPopupOpen, setSettingsPopupOpen] = useState(false);

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

            <nav
                className="fixed flex flex-col justify-between items-center w-70 min-h-screen bg-white border-r-1 border-slate-200"
            >
                <div className="w-full">
                    <div className="flex justify-start items-center gap-2 px-6 h-20 w-full">
                        <Icon size={20} />
                        <div className="flex flex-col">
                            <span className="text-black text-[16px] font-[600]">Expense Tracker</span>
                            <span className="text-neutral-600 text-[11px]/3">Pro</span>
                        </div>
                    </div>

                    <div className="px-6 py-2">
                        <Button variant="primary" onClick={() => setExpenseModalOpen(true)}>
                            <div className="flex items-center gap-2">
                                <Plus size={16} strokeWidth={3} />
                                <span>Adicionar despesa</span>
                            </div>
                        </Button>
                    </div>

                    <div className="flex flex-col font-semibold py-4 px-4 gap-2">
                        <SidebarButton disabled onClick={() => navigate("/dashboard")}>
                            <div className="flex gap-2 items-center">
                                <LayoutDashboard size={16} />
                                <span className="text-sm">Dashboard</span>
                            </div>
                        </SidebarButton>

                        <SidebarButton onClick={() => navigate("/incomes")}>
                            <div className="flex gap-2 items-center">
                                <BanknoteArrowUp size={16} />
                                <span className="text-sm">Entradas</span>
                            </div>
                        </SidebarButton>

                        <SidebarButton onClick={() => navigate("/expenses")}>
                            <div className="flex gap-2 items-center">
                                <BanknoteArrowDown size={16} />
                                <span className="text-sm">Saídas</span>
                            </div>
                        </SidebarButton>

                        <SidebarButton onClick={() => navigate("/categories")}>
                            <div className="flex gap-2 items-center">
                                <Rows2 size={16} />
                                <span className="text-sm">Categorias</span>
                            </div>
                        </SidebarButton>
                    </div>
                </div>

                <div>
                    <div className="flex gap-2 m-4 p-4 border-1 border-slate-200 rounded-2xl bg-emerald-100/20">
                        <div className="flex justify-center items-center rounded-full size-8 bg-teal-300/50 text-teal-500">
                            <Users size={16} />
                        </div>

                        <div className="flex flex-col">
                            <span className="text-black text-[12px] font-[500]">Apartamento 403</span>
                            <span className="text-neutral-600 text-[9px]/3">1 membro</span>
                        </div>
                    </div>


                    <div className="relative flex gap-2 w-full p-4 border-t-1 border-slate-200">
                        <div className={
                            `absolute bottom-16 left-2 bg-green-900/10 backdrop-blur-lg border-1 border-slate-200 rounded-xl p-3
                            ${settingsPopupOpen ? undefined : "hidden"}
                            `
                        }>
                            <button className="px-4 py-2 text-neutral-600 font-[600] bg-transparent hover:text-black disabled:bg-green-900/10 disabled:text-emerald-900 disabled:cursor-normal cursor-pointer w-full" onClick={() => navigate("/settings")}>
                                <div className="flex gap-2 items-center">
                                    <Settings size={16} strokeWidth={2.5} />
                                    <span className="text-sm">Configurações</span>
                                </div>
                            </button>

                            <button className="px-4 py-2 text-neutral-600 font-[600] bg-transparent hover:text-black disabled:bg-green-900/10 disabled:text-emerald-900 disabled:cursor-normal cursor-pointer w-full" onClick={logout}>
                                <div className="flex gap-2 items-center">
                                    <LogOut size={16} strokeWidth={2.5} />
                                    <span className="text-sm">Sair</span>
                                </div>
                            </button>
                        </div>

                        <div className="flex justify-center items-center cursor-pointer rounded-full size-10 bg-linear-120 from-emerald-600 from-30% to-teal-500" onClick={() => setSettingsPopupOpen(!settingsPopupOpen)}>
                            <span className="font-[600] text-sm text-white/80">
                                {
                                    authContext.user?.name
                                        .split(" ")
                                        .map(name => name[0].toUpperCase())
                                        .slice(0, 2)
                                        .join("")
                                }
                            </span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-black text-[14px] font-[500]">{authContext.user?.name}</span>
                            <span className="text-neutral-600 text-[11px]/3">{authContext.user?.email}</span>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}