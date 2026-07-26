import { Circle, CreditCard, Edit, Ticket, Trash, Wallet } from "lucide-react"
import { useState } from "react"
import { formatMoney, PAYMENT_METHOD_MAP } from "../utils"
import { MoreOptionButton } from "./Input"
import type { Expense } from "../api/types/expense"
import { Badge } from "./Badge"

type ExpensesTableProps = {
    data: Expense[] | undefined
    onEditClick?: (expense: Expense) => void
    onDeleteClick?: (expense: Expense) => void
}

type BasicTableProps = {
    data: {
        color: string
        title: string
        description?: string[]
        value: number
    }[]
    caption: {
        title: string
        description?: string
    }
}

export function BasicTable(props: BasicTableProps) {
    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-col px-6">
                <span className="text-md font-[600]">
                    {props.caption.title}
                </span>
                {props.caption.description ?
                    <span className="text-xs text-neutral-600">
                        {props.caption.description}
                    </span>
                    : null}
            </div>

            <div>
                {
                    props.data.map((entry, index) => {
                        return (
                            <div key={`basic-table-${index}`} className="items-center py-3 px-6 border-b-1 border-slate-200 last:border-0 last:pb-0">
                                {
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2 items-center">
                                            <div className="size-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${entry.color}33` }}>
                                                <Circle color={entry.color} fill={entry.color} size={10} />
                                            </div>

                                            <div className="flex flex-col">
                                                <span className="text-md font-[600]">
                                                    {entry.title}
                                                </span>
                                                {entry.description ? <span className="text-xs text-neutral-600">
                                                    {entry.description.map((description, index) => {
                                                        if (index === (entry.description?.length ?? 0) - 1) return description;
                                                        return `${description} · `;
                                                    })}
                                                </span> : null}
                                            </div>
                                        </div>

                                        <span className="text-red-500 font-semibold text-sm">-{formatMoney(String(entry.value.toFixed(2)))}</span>
                                    </div>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export function ExpensesTable(props: ExpensesTableProps) {
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>();
    const [showMoreOptionsModal, setShowMoreOptionsModal] = useState(false);
    const [moreOptionsModalCoordinates, setMoreOptionsModalCoordinates] = useState([0, 0]);

    function handleMoreOptionsButton(e: React.MouseEvent, expense: Expense) {
        const calcX = e.clientX - 80;
        const calcY = e.clientY + 20;

        document.body.classList.add("overflow-hidden");
        setSelectedExpense(expense);
        setMoreOptionsModalCoordinates([calcX, calcY]);
        setShowMoreOptionsModal(true);
    }

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex justify-between items-center py-3 px-6 border-b-1 border-slate-200 last:border-0 last:pb-0">
                <div className="flex justify-between w-full gap-6">
                    <span className="text-sm text-neutral-600 flex-2">Descrição</span>
                    <span className="text-sm text-neutral-600 flex-1">Categoria</span>
                    <span className="text-sm text-neutral-600 flex-1">Forma de pagamento</span>
                    <span className="text-sm text-neutral-600 flex-1">Data</span>
                    <span className="text-sm text-neutral-600 flex-1">Vencimento</span>
                    <span className="text-sm text-neutral-600 flex-1">Valor</span>
                    {!props.onEditClick && !props.onDeleteClick ? null : <div className="px-4" />}
                </div>

            </div>


            {showMoreOptionsModal ?
                <>
                    <div
                        className={`fixed overflow-hidden top-0 left-0 z-999 size-dvw bg-slate-900/2`}
                        onClick={() => {
                            setSelectedExpense(null);
                            setShowMoreOptionsModal(false);
                            document.body.classList.remove("overflow-hidden");
                        }}
                    />

                    <div
                        className={`fixed flex flex-col rounded-3xl w-40 bg-white z-999 border-1 border-slate-200 shadow-lg`}
                        style={{ left: moreOptionsModalCoordinates[0], top: moreOptionsModalCoordinates[1] }}
                    >
                        <button
                            className="flex items-center gap-2 border-b-1 px-4 py-2 border-slate-200 rounded-t-3xl hover:bg-slate-200/30 hover:cursor-pointer"
                            onClick={() => {
                                if (props.onEditClick && selectedExpense) {
                                    props.onEditClick(selectedExpense);
                                    setSelectedExpense(undefined);
                                    setShowMoreOptionsModal(false);
                                    document.body.classList.remove("overflow-hidden");
                                }
                            }}
                        >
                            <Edit size={16} />
                            Editar
                        </button>

                        <button
                            className="flex items-center gap-2 text-red-600 px-4 py-2 rounded-b-3xl hover:bg-slate-200/30 hover:cursor-pointer"
                            onClick={() => {
                                if (props.onDeleteClick && selectedExpense) {
                                    props.onDeleteClick(selectedExpense);
                                    setSelectedExpense(undefined);
                                    setShowMoreOptionsModal(false);
                                    document.body.classList.remove("overflow-hidden");
                                }
                            }}
                        >
                            <Trash size={16} />
                            Deletar
                        </button>
                    </div>
                </>
            : null}

            {props.data?.map((expense, index) => {
                const paymentMethodIcon = expense.paymentMethod === "CREDIT" ?
                    <CreditCard size={16} /> : expense.paymentMethod === "DEBIT" ?
                        <Wallet size={16} /> :
                        <Ticket size={16} />;

                const paymentMethodBadgeVariant = expense.paymentMethod === "CREDIT" ? "success" : expense.paymentMethod === "DEBIT" ? "info" : "default";

                return (
                    <div
                        key={`table-row-${index}`}
                        className="flex justify-between w-full items-center py-3 px-6 gap-6 border-b-1 border-slate-200 last:border-0 last:pb-0"
                    >
                        <div className="flex flex-col flex-2">
                            <span className="text-lg font-[600]">
                                {expense.title}
                            </span>
                            <span className="text-[11px] text-neutral-600">
                                {expense.description}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 flex-1">
                            <Circle size={10} color={`#${expense.category.color}`} fill={`#${expense.category.color}`} />
                            <span className="text-sm text-neutral-600">
                                {expense.category.title}
                            </span>
                        </div>

                        <div className="flex-1">
                            <Badge variant={paymentMethodBadgeVariant}>
                                <div className="flex gap-2">
                                    {paymentMethodIcon}
                                    {PAYMENT_METHOD_MAP[expense.paymentMethod]}
                                </div>
                            </Badge>
                        </div>

                        <div className="flex-1">
                            <span className="text-neutral-600 text-sm">
                                {(new Date(expense.transactionDate)).toLocaleDateString("pt-BR", { day: "numeric", month: "long", timeZone: "UTC" })}
                            </span>
                        </div>

                        <div className="flex-1">
                            <span className="text-neutral-600 text-sm">
                                {(new Date(expense.dueDate)).toLocaleDateString("pt-BR", { day: "numeric", month: "long", timeZone: "UTC" })}
                            </span>
                        </div>

                        <div className="flex flex-1">
                            <span className="font-semibold text-sm text-red-500">
                                {`-${formatMoney(String(Number(expense.amount).toFixed(2)))}`}
                            </span>
                        </div>

                        {!props.onEditClick && !props.onDeleteClick ? null : <MoreOptionButton onClick={(e) => handleMoreOptionsButton(e, expense)} />}
                    </div>
                )
            })}
        </div>
    )
}