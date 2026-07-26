import { useEffect, useState } from "react";
import { Input, SelectCard, Select, Slider } from "../Input";
import { Button } from "../Button";
import { CreditCard, Flame, Ticket, Wallet, X } from "lucide-react";
import { listCategories } from "../../api/services/category.service";
import { createExpense, updateExpense } from "../../api/services/expense.service";
import { PaymentMethod, type Expense } from "../../api/types/expense";
import { useToast } from "../../hooks/useToast";

type AddOrEditExpenseModalProps = {
    onClose: React.MouseEventHandler
    onSuccess: React.MouseEventHandler
    data?: Expense
}

export function AddOrEditExpenseModal(props: AddOrEditExpenseModalProps) {

    const [paymentMethod, setPaymentMethod] = useState<typeof PaymentMethod[keyof typeof PaymentMethod] | undefined>(props.data?.paymentMethod);
    const [title, setTitle] = useState(props.data?.title || "");
    const [amount, setAmount] = useState(Number(props.data?.amount) || 0);
    const [date, setDate] = useState(props.data?.transactionDate ? new Date(props.data.transactionDate) : new Date());
    const [categoryId, setCategoryId] = useState(props.data?.category.id || "");
    const [categoryOptions, setCategoryOptions] = useState<{ value: string, title: string, selected?: boolean }[]>();
    const [isEssential, setIsEssential] = useState(props.data?.isEssential || false);
    const [description, setDescription] = useState(props.data?.description || "");

    const { addToast } = useToast();

    async function insertOrUpdateExpense(e: React.MouseEvent) {
        try {
            if (paymentMethod) {
                const data = {
                    title,
                    description,
                    amount,
                    date: date.toLocaleDateString("en-CA"),
                    paymentMethod,
                    category: categoryId
                };

                if (props.data) {
                    await updateExpense({ id: props.data.id, ...data });
                    addToast("Despesa editada com sucesso!", "info");
                }
                else {
                    await createExpense(data);
                    addToast("Despesa criada com sucesso!", "info");
                }

                props.onSuccess(e);
            }
        } catch (e) {
            addToast("Erro ao inserir despesa!", "error");
        }
    }

    useEffect(() => {
        async function updateCategoriesOptions() {
            try {
                const categories = await listCategories();
                if (categories.length > 0) {
                    setCategoryOptions(categories.map(category => ({ 
                        value: category.id, 
                        title: category.title, 
                        selected: category.id === props.data?.category.id
                    })));
                }
            } catch (e) {
                addToast("Erro ao buscar categorias!", "error");
            }
        }

        updateCategoriesOptions();

    }, []);

    return (
        <div className="fixed inset-0 z-900 bg-black/60 flex items-center justify-center" onClick={props.onClose}>
            <div className="flex flex-col gap-4 bg-white p-6 rounded-2xl w-xl" onClick={(event) => event.stopPropagation()}>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <span className="text-xl font-[600]">
                            { props.data ? "Editar despesa" : "Nova despesa" }
                        </span>
                        <span className="text-xs text-neutral-600">
                            Mapeie o que você gasta. <br />Compras no crédito são debitadas apenas na data de vencimento.
                        </span>
                    </div>
                    <X
                        onClick={props.onClose}
                        className="cursor-pointer"
                    />
                </div>

                <div className="flex gap-2">
                    <SelectCard
                        icon={<Wallet size={16} />}
                        title="Débito"
                        description="Impacta sua carteira hoje"
                        selected={paymentMethod === "DEBIT" ? true : false}
                        onClick={() => setPaymentMethod("DEBIT")}
                    />

                    <SelectCard
                        icon={<CreditCard size={16} />}
                        title="Crédito"
                        description="Impacta na próxima fatura"
                        selected={paymentMethod === "CREDIT" ? true : false}
                        onClick={() => setPaymentMethod("CREDIT")}
                    />

                    <SelectCard
                        icon={<Ticket size={16} />}
                        title="Vale"
                        description="Alimentação / benefício"
                        selected={paymentMethod === "VOUCHER" ? true : false}
                        onClick={() => setPaymentMethod("VOUCHER")}
                    />
                </div>

                <Input
                    type="text"
                    label="Descrição"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); }}
                    placeholder="Ex.: Feira da semana"
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
                        label="Data da saída"
                        value={date.toISOString().split("T")[0]}
                        onChange={(e) => { setDate(new Date(e.target.value + "T00:00:00")) }}
                    />
                </div>

                <Select
                    label="Categoria"
                    options={categoryOptions}
                    onChange={(e) => { setCategoryId(e.target.value); }}
                />

                <div className="flex justify-between items-center w-full p-4 bg-slate-50/50 border-slate-200 border-1 rounded-3xl">
                    <div className="flex gap-2 items-center">
                        <div className="flex items-center justify-center size-10 bg-orange-100/60 rounded-full text-orange-500">
                            <Flame size={18} />
                        </div>

                        <div className="flex flex-col">
                            <span className="text-md font-[600]">
                                Despesa essencial
                            </span>
                            <span className="text-[11px] text-neutral-600">
                                Marque essa opção para definir essa despesa como essencial. <br />Ex.: Aluguel, compras, contas que você não pode pular.
                            </span>
                        </div>
                    </div>
                    <Slider 
                        onChange={() => setIsEssential(!isEssential)}
                    />
                </div>

                <Input
                    type="text"
                    label="Anotação (Opcional)"
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); }}
                    placeholder="Adicione uma anotação..."
                />

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
                            onClick={(e) => insertOrUpdateExpense(e)}
                        >{ props.data ? "Editar despesa" : "Cadastrar despesa" }</Button>
                    </div>
                    {/* <Button>Cadastrar</Button> */}
                </div>
            </div>
        </div>
    );
}