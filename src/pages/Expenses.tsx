import type { Expense, ExpenseTotal } from '../api/types/expense';
import { useState } from 'react';
import { useLoaderData, useRevalidator, useSearchParams } from "react-router";
import { Table } from "../components/Table";
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Edit, Trash } from 'lucide-react';
import ConfirmActionModal from '../components/modals/ConfirmActionModal';
import { useToast } from '../hooks/useToast';
import { EditExpenseModal } from '../components/modals/EditExpenseModal';
import { AddExpenseModal } from '../components/modals/AddExpenseModal';
import { deleteExpense } from '../api/services/expense.service';

const paymentMethodMapped = {
    CREDIT: "Crédito",
    DEBIT: "Débito",
    VOUCHER: "Vale Alimentação"
}

export default function Main() {
    const data = useLoaderData<{
        expenses: Expense[],
        expensesTotal: ExpenseTotal
    }>();
    
    const [searchParams, setSearchParams] = useSearchParams();
    const { revalidate } = useRevalidator();
    const { addToast } = useToast();
    
    const [selectedDate, setSelectedDate] = useState<Date>(initiateSelectedDate());
    const [selectedExpense, setSelectedExpense] = useState<Expense>();
    
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    
    const tableRows = getTableRows(data.expenses);

    function getTableRows(expenses: Expense[]) {
        return expenses
            .sort((a: Expense, b: Expense) => (new Date(b.transactionDate)).getTime() - (new Date(a.transactionDate)).getTime())
            .map(expense => {
                return [
                    expense.title,
                    expense.description || "-",
                    Number(expense.amount).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                    (new Date(expense.transactionDate)).toLocaleDateString("pt-BR", { day: "2-digit", month: "long" }),
                    (new Date(expense.dueDate)).toLocaleDateString("pt-BR", { day: "2-digit", month: "long" }),
                    paymentMethodMapped[expense.paymentMethod] || "Não encontrado",
                    expense.category.title,
                    { icon: <Edit className="cursor-pointer" />, callback: () => { setSelectedExpense(expense); setEditModalOpen(true); } },
                    { icon: <Trash color="red" className="cursor-pointer" />, callback: () => { setSelectedExpense(expense); setConfirmModalOpen(true); } }
                ];
            });
    }

    function handleDateChange(date: Date) {
        const formatted = date.toLocaleDateString("en-CA");

        setSearchParams({ date: formatted });
    }

    function initiateSelectedDate() {
        const dateParam = searchParams.get("date");

        return dateParam ? new Date(`${dateParam}T00:00`) : new Date();
    }

    async function deleteSelectedExpense() {
        try {
            if (selectedExpense) await deleteExpense(selectedExpense.id);
            revalidate();
            addToast(`Despesa "${selectedExpense?.title}" excluída!`, "info");
            setSelectedExpense(undefined);
        } catch {
            addToast(`Falha ao excluir "${selectedExpense?.title}"!`, "error");
        }
    }

    return (
        <>
            <AddExpenseModal
                open={addModalOpen}
                onClose={() => {
                    setAddModalOpen(false);
                    revalidate();
                }}
            />

            { selectedExpense ? <EditExpenseModal
                open={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    revalidate();
                }}
                data={selectedExpense}
            /> : null }

            <ConfirmActionModal
                title="Confirmar exclusão"
                description={<span>Tem certeza que deseja deletar a despesa <b><i>{selectedExpense?.title}</i>: <i>{selectedExpense?.description}</i></b>?</span>}
                color="red"
                open={confirmModalOpen}
                onSuccess={() => { deleteSelectedExpense(); setConfirmModalOpen(false); }}
                onClose={() => setConfirmModalOpen(false)}
            />
            
            <div className="flex flex-col items-center w-full">
                <div className="w-full flex justify-between mb-4">
                    <Button
                        color="emerald"
                        onClick={() => setAddModalOpen(true)}
                    >
                        Adicionar despesa
                    </Button>
                    <div className="w-3xs">
                        <Input
                            type="date"
                            label="Mês vigente"
                            value={selectedDate.toLocaleDateString("en-CA")}
                            onChange={(e) => {
                                const date = new Date(e.target.value + "T00:00:00");
                                setSelectedDate(date);
                                handleDateChange(date);
                            }}
                        />
                    </div>
                </div>
                <div
                    className="grid grid-cols-6 gap-6 w-full"
                >
                    <div className="col-span-6">
                        <div className="flex flex-col gap-6 justify-center items-center rounded-2xl bg-white border-1 border-neutral-100">
                            <div className="flex flex-col items-start w-full bg-neutral-100 rounded-t-2xl py-4 flex pl-10 items-center border-b-1 border-neutral-100">
                                <h2
                                    className="text-2xl font-semibold"
                                >
                                    {`Despesas no mês de ${selectedDate.toLocaleString("pt-BR", { month: "long" })}`}
                                </h2>
                                <h6>
                                    {`Total: ${data.expenses.reduce((acc, currentValue) => acc + Number(currentValue.amount), 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`}
                                </h6>
                            </div>
                            {
                                tableRows.length ?
                                    <Table
                                        header={["Título", "Descrição", "Valor", "Data da compra", "Data do pagamento", "Forma de pagamento", "Categoria"]}
                                        rows={tableRows}
                                    /> :
                                    <span className="mb-4 text-xl italic">Não há dados para o período selecionado</span>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}