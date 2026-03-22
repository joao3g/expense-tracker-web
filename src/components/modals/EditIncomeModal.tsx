import { useState } from "react";
import { Input } from "../Input";
import { Button } from "../Button";
import { X } from "lucide-react";
import { updateIncome } from "../../api/services/income.service";
import { useToast } from "../../hooks/useToast";
import type { Income } from "../../api/types/income";

export function EditIncomeModal({ open, data, onClose }: { open: boolean, data: Income, onClose: React.MouseEventHandler }) {
    const [title, setTitle] = useState(data.title);
    const [amount, setAmount] = useState(Number(data.amount));
    const [date, setDate] = useState(new Date(String(data.date).split("T")[0] + "T00:00"));
    
    const { addToast } = useToast();

    async function insertIncome(e: React.MouseEvent) {
        try {
            const toUpdate = {
                id: data.id,
                title,
                amount,
                date: date.toLocaleDateString("en-CA")
            };
            
            await updateIncome(toUpdate);
            addToast("Entrada editada com sucesso!", "success");
            onClose(e);
        } catch (e) {
            addToast("Erro ao editar entrada!", "error");
        }
    }
    
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-900 bg-black/60 flex items-center justify-center" onClick={onClose}>
            <div className="flex flex-col gap-4 bg-white p-6 rounded w-4xl" onClick={(event) => event.stopPropagation()}>
                <div className="flex flex-row justify-between">
                    <h1 className="mb-4 text-xl">Editar entrada</h1>
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

                <div className="flex flex-row gap-6">
                    <Input
                        type="number"
                        label="Valor (R$)"
                        value={amount}
                        onChange={(e) => { setAmount(Number(e.target.value)); }}
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
                        onClick={(e) => insertIncome(e)}
                    >Editar entrada</Button>
                    {/* <Button>Cadastrar</Button> */}
                </div>
            </div>
        </div>
    );
}