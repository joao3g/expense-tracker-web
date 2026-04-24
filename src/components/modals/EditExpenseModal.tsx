import { useEffect, useState } from "react";
import { Input } from "../Input";
import { Button } from "../Button";
import { X } from "lucide-react";
import { updateExpense } from "../../api/services/expense.service";
import { useToast } from "../../hooks/useToast";
import type { Expense } from "../../api/types/expense";

export function EditExpenseModal({ open, data, onClose }: { open: boolean, data: Expense, onClose: React.MouseEventHandler }) {
    const [title, setTitle] = useState(data.title);
    const [description, setDescription] = useState(data.description);
    const [amount, setAmount] = useState(Number(data.amount));
    const [date, setDate] = useState(new Date(String(data.transactionDate).split("T")[0] + "T00:00"));
    
    const { addToast } = useToast();

    async function insertExpense(e: React.MouseEvent) {
        try {
            const toUpdate = {
                id: data.id,
                title,
                description,
                amount,
                date: date.toLocaleDateString("en-CA")
            };
            
            await updateExpense(toUpdate);
            addToast("Saída editada com sucesso!", "success");
            onClose(e);
        } catch (e) {
            addToast("Erro ao editar saída!", "error");
        }
    }

    useEffect(() => {
        if (open) {
            setTitle(data.title);
            setDescription(data.description);
            setAmount(Number(data.amount));
            setDate(new Date(String(data.transactionDate).split("T")[0] + "T00:00"));
        }
    }, [open]);
    
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-900 bg-black/60 flex items-center justify-center" onClick={onClose}>
            <div className="flex flex-col gap-4 bg-white p-6 rounded w-4xl" onClick={(event) => event.stopPropagation()}>
                <div className="flex flex-row justify-between">
                    <h1 className="mb-4 text-xl">Editar saída</h1>
                    <X
                        onClick={onClose}
                        className="cursor-pointer"
                    />
                </div>
                <Input
                    type="text"
                    label="Título"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); }}
                />

                <Input
                    type="text"
                    label="Descrição"
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); }}
                />

                <div className="flex flex-row gap-6">
                    <Input
                        type="text"
                        label="Valor (R$)"
                        value={amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        onChange={(e) => { setAmount(Number(e.target.value.replace(/\D/g, "") || 0) / 100); }}
                    />

                    <Input
                        type="date"
                        label="Data"
                        
                        value={date.toLocaleDateString("en-CA")}
                        onChange={(e) => { setDate(new Date(e.target.value + "T00:00:00")) }}
                    />

                </div>

                <div className="flex flex-row gap-x-3 mt-6">
                    <Button
                        color="emerald"
                        onClick={(e) => insertExpense(e)}
                    >Editar saída</Button>
                    {/* <Button>Cadastrar</Button> */}
                </div>
            </div>
        </div>
    );
}