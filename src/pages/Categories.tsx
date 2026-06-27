import type { Income, IncomeTotal } from '../api/types/income';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLoaderData, useRevalidator, useSearchParams } from "react-router";
import { Input, MoreOptionButton } from '../components/Input';
import { Button } from '../components/Button';
import { ArrowUpDown, ArrowUpRight, Edit, Plus, Tag, Trash, TrendingUp } from 'lucide-react';
import { AddOrEditIncomeModal } from '../components/modals/AddOrEditIncomeModal';
import DeleteModal from '../components/modals/DeleteConfirmModal';
import { useToast } from '../hooks/useToast';
import { formatMoney } from '../utils';
import { CardSkeleton } from '../components/CardSkeleton';
import { useDate } from '../hooks/useDate';
import type { Expense } from '../api/types/expense';
import type { Category } from '../api/types/category';
import { AddOrEditCategoryModal } from '../components/modals/AddOrEditCategoryModal';
import { deleteCategory } from '../api/services/category.service';
import { CategoryIcon } from '../components/Icon';

export default function Main() {
    const data = useLoaderData<{
        expenses: Expense[],
        categories: Category[]
    }>();

    const [searchParams, setSearchParams] = useSearchParams();
    const { revalidate } = useRevalidator();
    const { addToast } = useToast();

    const { currentDate } = useDate();
    const [selectedCategory, setSelectedCategory] = useState<Category>();

    const [addOrEditModalOpen, setAddOrEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [showMoreOptionsModal, setShowMoreOptionsModal] = useState(false);
    const [moreOptionsModalCoordinates, setMoreOptionsModalCoordinates] = useState([0, 0]);

    // const query = useQuery({
    //     queryKey: ["expenses"],
    //     queryFn: () =>
    //         getIncomesByMonth(currentDate)
    // });

    // throw query;

    function handleDateChange(date: Date) {
        const formatted = date.toLocaleDateString("en-CA");

        setSearchParams({ date: formatted });
    }

    async function deleteSelectedCategory() {
        try {
            if (selectedCategory) await deleteCategory(selectedCategory.id);
            revalidate();
            addToast(`Categoria "${selectedCategory?.title}" excluída!`, "info");
            setSelectedCategory(undefined);
        } catch {
            addToast(`Falha ao excluir "${selectedCategory?.title}"!`, "error");
        }
    }

    function handleMoreOptionsButton(e: React.MouseEvent, category: Category) {
        const calcX = e.clientX - 80;
        const calcY = e.clientY + 20;

        setSelectedCategory(category);
        setMoreOptionsModalCoordinates([calcX, calcY]);
        setShowMoreOptionsModal(true);
    }

    return (
        <>
            {showMoreOptionsModal ?
                <>
                    <div
                        className={`fixed top-0 left-0 z-999 size-dvw bg-slate-900/2`}
                        onClick={() => {
                            setSelectedCategory(undefined);
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
                <AddOrEditCategoryModal
                    onClose={() => {
                        setAddOrEditModalOpen(false);
                        setSelectedCategory(undefined);
                        revalidate();
                    }}
                    data={selectedCategory}
                />
                : null}

            {deleteModalOpen ?
                <DeleteModal
                    title={`Deletar a categoria "${selectedCategory?.title}"?`}
                    description="Essa categoria será removida da sua lista. Transações existentes relacionadas com essa categoria serão mantidas e marcadas como descategorizadas."
                    onDelete={() => { deleteSelectedCategory(); setDeleteModalOpen(false); }}
                    onClose={() => setDeleteModalOpen(false)}
                />
                : null}

            <div className="flex flex-col grid-cols-3 items-center w-full">
                <div className="flex justify-between items-center mb-4 w-full">
                    <div className="flex flex-col">
                        <span className="text-3xl font-[600]">
                            Categorias
                        </span>
                        <span className="text-sm/6 text-neutral-600">
                            Distribuição das despesas por categorias no mês selecionado.
                        </span>
                    </div>

                    <div className="w-max">
                        <Button
                            variant="primary"
                            onClick={() => setAddOrEditModalOpen(true)}
                        >
                            <div className="flex items-center gap-2">
                                <Plus size={16} strokeWidth={3} />
                                Adicionar categoria
                            </div>
                        </Button>
                    </div>
                </div>
                <div
                    className="grid grid-cols-4 gap-6 w-full"
                >

                    {
                        data.categories.map((category, index) =>
                            <div key={`category-div-${index}`} className="col-span-1">
                                <CardSkeleton>
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-2">
                                            <CategoryIcon color={category.color} />

                                            <div className="flex flex-col">
                                                <span className="text-md font-[600]">
                                                    {category.title}
                                                </span>
                                                <span className="text-[11px]/2 text-neutral-600">
                                                    {data.expenses.reduce((acc, expense) => {
                                                        if (expense.category.id === category.id) return acc + 1;
                                                        return acc;
                                                    }, 0)} transações
                                                </span>
                                            </div>
                                        </div>

                                        {/* {renderBadge(Number(data.expensesTotal[3]._sum.amount), Number(data.expensesTotal[2]._sum.amount), true)} */}

                                        <MoreOptionButton onClick={(e) => handleMoreOptionsButton(e, category)} />
                                    </div>

                                    <span className="font-[600] text-2xl">{
                                        formatMoney(String(Number(data.expenses.reduce((acc, expense) => {
                                            if (expense.category.id === category.id) return acc + Number(expense.amount);
                                            return acc;
                                        }, 0)).toFixed(2)))
                                    }</span>
                                </CardSkeleton>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    );
}