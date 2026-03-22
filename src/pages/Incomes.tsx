import type { Income, IncomeTotal } from '../api/types/income';
import { useState } from 'react';
import { useLoaderData, useRevalidator, useSearchParams } from "react-router";
import { Table } from "../components/Table";
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Edit, Trash } from 'lucide-react';
import { AddIncomeModal } from '../components/modals/AddIncomeModal';
import ConfirmActionModal from '../components/modals/ConfirmActionModal';
import { deleteIncome } from '../api/services/income.service';
import { useToast } from '../hooks/useToast';
import { EditIncomeModal } from '../components/modals/EditIncomeModal';

export default function Main() {
    const data = useLoaderData<{
        incomes: Income[],
        incomesTotal: IncomeTotal
    }>();
    
    const [searchParams, setSearchParams] = useSearchParams();
    const { revalidate } = useRevalidator();
    const { addToast } = useToast();
    
    const [selectedDate, setSelectedDate] = useState<Date>(initiateSelectedDate());
    const [selectedIncome, setSelectedIncome] = useState<Income>();
    
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    
    const tableRows = getTableRows(data.incomes);

    function getTableRows(incomes: Income[]) {
        return incomes.map(income => {
            return [
                income.title,
                Number(income.amount).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                income.user.name,
                { icon: <Edit className="cursor-pointer" />, callback: () => { setSelectedIncome(income); setEditModalOpen(true); } },
                { icon: <Trash color="red" className="cursor-pointer" />, callback: () => { setSelectedIncome(income); setConfirmModalOpen(true); } }
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

    async function deleteSelectedIncome() {
        try {
            if (selectedIncome) await deleteIncome(selectedIncome.id);
            revalidate();
            addToast(`Entrada "${selectedIncome?.title}" excluída!`, "info");
            setSelectedIncome(undefined);
        } catch {
            addToast(`Falha ao excluir "${selectedIncome?.title}"!`, "error");
        }
    }

    return (
        <>
            <AddIncomeModal
                open={addModalOpen}
                onClose={() => {
                    setAddModalOpen(false);
                    revalidate();
                }}
            />

            { selectedIncome ? <EditIncomeModal
                open={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    revalidate();
                }}
                data={selectedIncome}
            /> : null }

            <ConfirmActionModal
                title="Confirmar exclusão"
                description={<span>Tem certeza que deseja deletar a entrada <b><i>{selectedIncome?.title}</i></b>?</span>}
                color="red"
                open={confirmModalOpen}
                onSuccess={() => { deleteSelectedIncome(); setConfirmModalOpen(false); }}
                onClose={() => setConfirmModalOpen(false)}
            />
            
            <div className="flex flex-col items-center w-full">
                <div className="w-full flex justify-between mb-4">
                    <Button
                        color="emerald"
                        onClick={() => setAddModalOpen(true)}
                    >
                        Adicionar entrada
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
                                    {`Entradas no mês de ${selectedDate.toLocaleString("pt-BR", { month: "long" })}`}
                                </h2>
                                <h6>
                                    {`Total: ${data.incomes.reduce((acc, currentValue) => acc + Number(currentValue.amount), 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`}
                                </h6>
                            </div>
                            {
                                tableRows.length ?
                                    <Table
                                        header={["Título", "Valor", "Usuário"]}
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