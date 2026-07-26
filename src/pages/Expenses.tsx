import type { Expense } from '../api/types/expense';
import { useEffect, useState } from 'react';
import { SearchInput } from '../components/Input';
import { Button } from '../components/Button';
import { Plus, TrendingDown } from 'lucide-react';
import DeleteModal from '../components/modals/DeleteConfirmModal';
import { useToast } from '../hooks/useToast';
import { AddOrEditExpenseModal } from '../components/modals/AddOrEditExpenseModal';
import { deleteExpense } from '../api/services/expense.service';
import { formatMoney, PAYMENT_METHOD_MAP } from '../utils';
import { CardSkeleton } from '../components/CardSkeleton';
import { Badge } from '../components/Badge';
import { ExpensesTable } from '../components/Table';
import { useDate } from '../hooks/useDate';
import { useQuery } from '@tanstack/react-query';
import { expensesByMonthQuery } from '../queries/expenses';
import { queryClient } from '../Routes';

export default function Main() {
    const { addToast } = useToast();

    const { currentDate } = useDate();
    const [selectedExpense, setSelectedExpense] = useState<Expense>();

    const query = useQuery(expensesByMonthQuery(currentDate));

    const expensesTotal = query.data?.reduce((acc, expense) => acc + Number(expense.amount), 0).toFixed(2);

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [tableData, setTableData] = useState(handleTableData(query.data));

    useEffect(() => setTableData(handleTableData(query.data)), [query.data])

    function handleSearch() {
        let filteredExpenses = query.data;

        if (search) {
            const normalizedSearch = search.toLowerCase();

            filteredExpenses = query.data?.filter(expense =>
                expense.title.toLowerCase().includes(normalizedSearch) ||
                expense.description?.toLowerCase().includes(normalizedSearch) ||
                expense.category.title.toLowerCase().includes(normalizedSearch) ||
                formatMoney(String(Number(expense.amount).toFixed(2))).toLowerCase().includes(normalizedSearch) ||
                PAYMENT_METHOD_MAP[expense.paymentMethod]
                    .toLowerCase()
                    .includes(normalizedSearch)
            );
        }

        if (filteredExpenses) setTableData(handleTableData(filteredExpenses));
    };

    function handleTableData(expenses: Expense[] | undefined) {
        return expenses
            ?.sort((a: Expense, b: Expense) => (new Date(b.transactionDate)).getTime() - (new Date(a.transactionDate)).getTime());
    }

    function handleAddOrEdit() {
        setSelectedExpense(undefined);
        setAddModalOpen(false);
        queryClient.refetchQueries({ queryKey: expensesByMonthQuery(currentDate).queryKey });
    }

    async function deleteSelectedExpense() {
        try {
            if (selectedExpense) await deleteExpense(selectedExpense.id);

            addToast(`Despesa "${selectedExpense?.title}" excluída!`, "info");

            queryClient.setQueryData(expensesByMonthQuery(currentDate).queryKey, (oldValue: Expense[]) =>
                oldValue.filter(expense => expense.id !== selectedExpense?.id));

            setSelectedExpense(undefined);
            setDeleteModalOpen(false);
        } catch {
            addToast(`Falha ao excluir "${selectedExpense?.title}"!`, "error");
        }
    }

    return (
        <>
            {addModalOpen ?
                <AddOrEditExpenseModal
                    onClose={() => {
                        setAddModalOpen(false);
                        setSelectedExpense(undefined);
                    }}
                    onSuccess={handleAddOrEdit}
                    data={selectedExpense}
                />
                : null}

            {deleteModalOpen ?
                <DeleteModal
                    title={`Deletar a despesa "${selectedExpense?.title}"?`}
                    description="Essa despesa será permanentemente removida e seus dashboards serão atualizados imediatamente. Essa ação não pode ser desfeita."
                    onDelete={deleteSelectedExpense}
                    onClose={() => setDeleteModalOpen(false)}
                />
                : null}

            <div className="flex flex-col grid-cols-3 items-center w-full">
                <div className="flex justify-between items-center mb-4 w-full">
                    <div className="flex flex-col">
                        <span className="text-3xl font-[600]">
                            Despesas
                        </span>
                        <span className="text-sm/6 text-neutral-600">
                            {`${query.data?.length} transações esse mês · ${formatMoney(String(expensesTotal))}`}
                        </span>
                    </div>

                    <div className="w-max">
                        <Button
                            variant="primary"
                            onClick={() => setAddModalOpen(true)}
                        >
                            <div className="flex items-center gap-2">
                                <Plus size={16} strokeWidth={3} />
                                Adicionar despesa
                            </div>
                        </Button>
                    </div>
                </div>

                {
                    query.data?.length ?
                        <div className="w-full">
                            <CardSkeleton padding={{ left: 0, right: 0 }}>
                                <div className="flex items-center border-b-1 border-slate-200 pl-6 pb-4 gap-2">
                                    <div className="w-80">
                                        <SearchInput
                                            placeholder="Buscar por despesas..."
                                            onChange={(e) => setSearch(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" ? handleSearch() : null}
                                        />
                                    </div>

                                    <Badge variant="default">
                                        <span className="font-bold">
                                            {currentDate.toLocaleDateString("pt-BR", { month: "long" })[0].toUpperCase() + currentDate.toLocaleDateString("pt-BR", { month: "long" }).slice(1)}
                                        </span>
                                    </Badge>

                                    <Badge variant="default">
                                        <span className="font-bold">
                                            {currentDate.toLocaleDateString("pt-BR", { year: "numeric" })}
                                        </span>
                                    </Badge>

                                    <Badge variant="default">
                                        <span className="font-bold">
                                            Todas as categorias
                                        </span>
                                    </Badge>
                                </div>

                                <div>
                                    <ExpensesTable
                                        data={tableData}
                                        onEditClick={(expense) => {
                                            setSelectedExpense(expense);
                                            setAddModalOpen(true);
                                        }}
                                        onDeleteClick={(expense) => {
                                            setSelectedExpense(expense);
                                            setDeleteModalOpen(true);
                                        }}
                                    />
                                </div>
                            </CardSkeleton>
                        </div>
                        :
                        <div className="w-full">
                            <CardSkeleton>
                                <div className="flex flex-col gap-4 justify-center items-center py-12">
                                    <div className="flex items-center justify-center size-16 bg-neutral-100/60 rounded-full text-neutral-500">
                                        <TrendingDown size={24} />
                                    </div>

                                    <span className="text-lg font-[600]">{`Nenhum registro em ${currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}`}</span>

                                    <span className="text-sm text-center w-2/5">Nenhuma despesa foi encontrada no período selecionado. Navegue para outro mês usando o seletor na barra lateral, ou adicione uma nova despesa neste mês.</span>
                                </div>
                            </CardSkeleton>
                        </div>
                }
            </div>
        </>
    );
}