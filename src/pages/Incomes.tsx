import type { Income } from '../api/types/income';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MoreOptionButton } from '../components/Input';
import { Button } from '../components/Button';
import { Edit, Plus, Trash, TrendingUp } from 'lucide-react';
import { AddOrEditIncomeModal } from '../components/modals/AddOrEditIncomeModal';
import DeleteModal from '../components/modals/DeleteConfirmModal';
import { deleteIncome } from '../api/services/income.service';
import { useToast } from '../hooks/useToast';
import { formatMoney } from '../utils';
import { CardSkeleton } from '../components/CardSkeleton';
import { useDate } from '../hooks/useDate';
import { incomesByMonthQuery } from '../queries/incomes';
import { queryClient } from '../Routes';

export default function Main() {
    const { addToast } = useToast();

    const { currentDate } = useDate();
    const [selectedIncome, setSelectedIncome] = useState<Income>();

    const [addOrEditModalOpen, setAddOrEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [showMoreOptionsModal, setShowMoreOptionsModal] = useState(false);
    const [moreOptionsModalCoordinates, setMoreOptionsModalCoordinates] = useState([0, 0]);

    const query = useQuery(incomesByMonthQuery(currentDate));

    const incomes = query.data;
    const incomesTotal = query.data?.reduce((acc, income) => acc + Number(income.amount) , 0).toFixed(2);

    async function deleteSelectedIncome() {
        try {
            if (selectedIncome) await deleteIncome(selectedIncome.id);

            addToast(`Entrada "${selectedIncome?.title}" excluída!`, "info");

            queryClient.setQueryData(incomesByMonthQuery(currentDate).queryKey, (oldValue: Income[]) =>
                    oldValue.filter(income => income.id !== selectedIncome?.id));

            setSelectedIncome(undefined);
            setDeleteModalOpen(false);
        } catch {
            addToast(`Falha ao excluir "${selectedIncome?.title}"!`, "error");
        }
    }

    function handleMoreOptionsButton(e: React.MouseEvent, income: Income) {
        const calcX = e.clientX - 80;
        const calcY = e.clientY + 20;

        setSelectedIncome(income);
        setMoreOptionsModalCoordinates([calcX, calcY]);
        setShowMoreOptionsModal(true);
    }

    function handleAddOrEdit() {
        setSelectedIncome(undefined);
        setAddOrEditModalOpen(false);
        queryClient.refetchQueries({ queryKey: [incomesByMonthQuery(currentDate).queryKey[0]] });
    }

    return (
        <>
            {showMoreOptionsModal ?
                <>
                    <div
                        className={`fixed top-0 left-0 z-999 size-dvw bg-slate-900/2`}
                        onClick={() => {
                            setSelectedIncome(undefined);
                            setShowMoreOptionsModal(false);
                        }}
                    />

                    <div
                        className={`absolute flex flex-col rounded-3xl w-40 bg-white z-999 border-1 border-slate-200 shadow-lg`}
                        style={{ left: moreOptionsModalCoordinates[0], top: moreOptionsModalCoordinates[1] }}
                    >
                        <button
                            className="flex items-center gap-2 border-b-1 px-4 py-2 border-slate-200 rounded-t-3xl hover:bg-slate-200/30 hover:cursor-pointer"
                            onClick={() => {
                                setAddOrEditModalOpen(true);
                                setShowMoreOptionsModal(false);
                            }}
                        >
                            <Edit size={16} />
                            Editar
                        </button>

                        <button
                            className="flex items-center gap-2 text-red-600 px-4 py-2 rounded-b-3xl hover:bg-slate-200/30 hover:cursor-pointer"
                            onClick={() => {
                                setDeleteModalOpen(true);
                                setShowMoreOptionsModal(false);
                            }}
                        >
                            <Trash size={16} />
                            Deletar
                        </button>
                    </div>
                </>
                : null}

            {addOrEditModalOpen ?
                <AddOrEditIncomeModal
                    onClose={() => {
                        setAddOrEditModalOpen(false);
                        setSelectedIncome(undefined);
                    }}
                    onSuccess={handleAddOrEdit}
                    data={selectedIncome}
                />
                : null}

            {deleteModalOpen ?
                <DeleteModal
                    title={`Deletar a entrada "${selectedIncome?.title}"?`}
                    description="Essa entrada será permanentemente removida e seus dashboards serão atualizados imediatamente. Essa ação não pode ser desfeita."
                    onDelete={deleteSelectedIncome}
                    onClose={() => setDeleteModalOpen(false)}
                />
                : null}

            <div className="flex flex-col grid-cols-3 items-center w-full">
                <div className="flex justify-between items-center mb-4 w-full">
                    <div className="flex flex-col">
                        <span className="text-3xl font-[600]">
                            Entradas
                        </span>
                        <span className="text-sm/6 text-neutral-600">
                            {`${incomes?.length} fonte(s) de entrada · ${formatMoney(String(incomesTotal))} esse mês`}
                        </span>
                    </div>

                    <div className="w-max">
                        <Button
                            variant="primary"
                            onClick={() => setAddOrEditModalOpen(true)}
                        >
                            <div className="flex items-center gap-2">
                                <Plus size={16} strokeWidth={3} />
                                Adicionar entrada
                            </div>
                        </Button>
                    </div>
                </div>
                <div
                    className="grid grid-cols-6 gap-6 w-full"
                >

                    {incomes?.length ?
                        incomes.map((income, index) =>
                            <div key={`income-div-${index}`} className="col-span-2">
                                <CardSkeleton>
                                    <div className="flex justify-between items-center">
                                        <div className="bg-green-100 size-10 rounded-full flex justify-center items-center">
                                            <TrendingUp size={20} className="text-green-900" />
                                        </div>

                                        {/* {renderBadge(Number(data.expensesTotal[3]._sum.amount), Number(data.expensesTotal[2]._sum.amount), true)} */}

                                        <MoreOptionButton onClick={(e) => handleMoreOptionsButton(e, income)} />
                                    </div>

                                    <div className="flex flex-col justify-between items-start mt-4 mb-4">
                                        <span className="text-md font-[600]">{income.title}</span>
                                    </div>

                                    <span className="text-green-600 font-[600] text-2xl">+{formatMoney(String(Number(income.amount).toFixed(2)))}</span>
                                </CardSkeleton>
                            </div>
                        )
                        :
                        <div className="col-span-6">
                            <CardSkeleton>
                                <div className="flex flex-col gap-4 justify-center items-center py-12">
                                    <div className="flex items-center justify-center size-16 bg-neutral-100/60 rounded-full text-neutral-500">
                                        <TrendingUp size={24} />
                                    </div>

                                    <span className="text-lg font-[600]">{`Nenhum registro em ${currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}`}</span>

                                    <span className="text-sm text-center w-2/5">Nenhum entrada foi encontrada no período selecionado. Navegue para outro mês usando o seletor na barra lateral, ou adicione uma nova entrada para este mês.</span>
                                </div>
                            </CardSkeleton>
                        </div>
                    }
                </div>
            </div>
        </>
    );
}