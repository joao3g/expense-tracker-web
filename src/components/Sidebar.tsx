import {
    LayoutDashboard,
    LogOut,
    BanknoteArrowDown,
    BanknoteArrowUp,
    Settings,
    Plus,
    Tags,
    Users,
    Calendar,
    ChevronRight,
    ChevronLeft
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useDate } from "../hooks/useDate";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { AddOrEditExpenseModal } from "./modals/AddOrEditExpenseModal";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { queryClient } from "../Routes";
import { expensesByMonthQuery } from "../queries/expenses";

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
    const { pathname } = useLocation();
    const { currentDate, setCurrentDate } = useDate();

    function logout() {
        navigate("/");
        authContext.logout();
    }

    function setNextMonth() {
        const nextDate = new Date(currentDate);

        nextDate.setDate(13);
        nextDate.setMonth(nextDate.getMonth() + 1);

        setCurrentDate(nextDate);
    }

    function setPreviousMonth() {
        const previousDate = new Date(currentDate);

        previousDate.setDate(13);
        previousDate.setMonth(previousDate.getMonth() - 1);

        setCurrentDate(previousDate);
    }

    function handleNewExpense() {
        setExpenseModalOpen(false);
        queryClient.refetchQueries({ queryKey: [expensesByMonthQuery(currentDate).queryKey[0]] });
    }

    return (
        <>
            {expenseModalOpen ?
                <AddOrEditExpenseModal
                    onClose={() => {
                        setExpenseModalOpen(false);
                    }}
                    onSuccess={handleNewExpense}
                />
                : null}

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

                    <div className="flex flex-col gap-4 px-6 py-4 bg-linear-to-t from-green-50 to-white border-1 border-slate-200 rounded-3xl mx-4 mt-2">
                        <div className="flex justify-between">
                            <div className="flex gap-1 items-center">
                                <Calendar size={12} />
                                <span className="text-xs">PERÍODO</span>
                            </div>
                            <span className="text-green-500 text-xs underline cursor-pointer" onClick={() => setCurrentDate(new Date())}>Mês atual</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div
                                className="size-8 flex items-center justify-center text-neutral-600 rounded-full cursor-pointer"
                                onClick={setPreviousMonth}
                            >
                                <ChevronLeft size={14} />
                            </div>

                            <span className="text-sm font-[600]">{currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })[0].toUpperCase() + currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }).slice(1)}</span>

                            <div
                                className="size-8 flex items-center justify-center text-neutral-600 rounded-full cursor-pointer"
                                onClick={setNextMonth}
                            >
                                <ChevronRight size={14} />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col font-semibold py-4 px-4 gap-2">
                        <SidebarButton disabled={pathname === "/dashboard" ? true : false} onClick={() => navigate("/dashboard")}>
                            <div className="flex gap-2 items-center">
                                <LayoutDashboard size={16} />
                                <span className="text-sm">Dashboard</span>
                            </div>
                        </SidebarButton>

                        <SidebarButton disabled={pathname === "/incomes" ? true : false} onClick={() => navigate("/incomes")}>
                            <div className="flex gap-2 items-center">
                                <BanknoteArrowUp size={16} />
                                <span className="text-sm">Entradas</span>
                            </div>
                        </SidebarButton>

                        <SidebarButton disabled={pathname === "/expenses" ? true : false} onClick={() => navigate("/expenses")}>
                            <div className="flex gap-2 items-center">
                                <BanknoteArrowDown size={16} />
                                <span className="text-sm">Saídas</span>
                            </div>
                        </SidebarButton>

                        <SidebarButton disabled={pathname === "/categories" ? true : false} onClick={() => navigate("/categories")}>
                            <div className="flex gap-2 items-center">
                                <Tags size={16} />
                                <span className="text-sm">Categorias</span>
                            </div>
                        </SidebarButton>
                    </div>
                </div>

                <div className="w-full">
                    <div className="flex gap-2 m-4 p-4 border-1 border-slate-200 rounded-2xl bg-emerald-100/20">
                        <div className="flex justify-center items-center rounded-full size-8 bg-teal-300/50 text-teal-500">
                            <Users size={16} />
                        </div>

                        <div className="flex flex-col">
                            <span className="text-black text-[12px] font-[500]">{authContext.user?.group.title}</span>
                            <span className="text-neutral-600 text-[9px]/3">{authContext.user?.group.totalMembers} membro{authContext.user?.group.totalMembers || 0 > 1 ? "s" : null}</span>
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
                            <span className="font-[700] text-sm text-white/80">
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