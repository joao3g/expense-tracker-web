import { useState } from "react";
import { Input } from "../Input";
import { Button } from "../Button";
import { X } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import type { Income } from "../../api/types/income";
import { createIncome, updateIncome } from "../../api/services/income.service";

type AddOrEditIncomeModalProps = {
    onClose: React.MouseEventHandler
    onSuccess: React.MouseEventHandler
    data?: Income
}

export function AddOrEditIncomeModal(props: AddOrEditIncomeModalProps) {

    const [title, setTitle] = useState(props.data?.title || "");
    const [amount, setAmount] = useState(Number(props.data?.amount) || 0);
    const [date, setDate] = useState(props.data?.date ? new Date(props.data.date) : new Date());

    const { addToast } = useToast();

    async function insertOrUpdateIncome(e: React.MouseEvent) {
        try {
            const data = {
                title,
                amount,
                date: date.toLocaleDateString("en-CA")
            };

            if (props.data) {
                await updateIncome({ id: props.data.id, ...data });
                addToast("Entrada editada com sucesso!", "info");
            }
            else {
                await createIncome(data);
                addToast("Entrada criada com sucesso!", "info");
            }

            props.onSuccess(e);
        } catch (e) {
            if (props.data) addToast("Erro ao editar entrada!", "error");
            else addToast("Erro ao inserir entrada!", "error");
        }
    }

    return (
        <div className="fixed inset-0 z-900 bg-black/60 flex items-center justify-center" onClick={props.onClose}>
            <div className="flex flex-col gap-4 bg-white p-6 rounded-2xl w-xl" onClick={(event) => event.stopPropagation()}>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <span className="text-xl font-[600]">
                            { props.data ? "Editar entrada" : "Nova entrada" }
                        </span>
                        <span className="text-xs text-neutral-600">
                            Descubra de onde seu dinheiro vem — Salários, trabalhos autônomos, dividendos e mais.
                        </span>
                    </div>
                    <X
                        onClick={props.onClose}
                        className="cursor-pointer"
                    />
                </div>

                <Input
                    type="text"
                    label="Descrição"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); }}
                    placeholder="Ex.: Salário"
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

                <div className="flex flex-row justify-end gap-x-3 mt-2">
                    <div>
                        <Button
                            variant="secondary"
                            onClick={props.onClose}
                        >Cancelar</Button>
                    </div>

                    <div>
                        <Button
                            variant="primary"
                            onClick={(e) => insertOrUpdateIncome(e)}
                        >{ props.data ? "Editar entrada" : "Cadastrar entrada" }</Button>
                    </div>
                    {/* <Button>Cadastrar</Button> */}
                </div>
            </div>
        </div>
    );
}