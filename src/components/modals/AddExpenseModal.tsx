import { useEffect, useState } from "react";
import { Input } from "../Input";
import { Button } from "../Button";
import { X } from "lucide-react";
import { Select } from "../Select";
import { listCategories } from "../../api/services/category.service";
import { createExpense } from "../../api/services/expense.service";
import { PaymentMethod } from "../../api/types/expense";

export function AddExpenseModal({ open, onClose }: { open: boolean, onClose?: React.MouseEventHandler }) {
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState(new Date());
    const [paymentMethod, setPaymentMethod] = useState<typeof PaymentMethod[keyof typeof PaymentMethod]>();
    const [categoryId, setCategoryId] = useState("");
    const [categoryOptions, setCategoryOptions] = useState<{ value: string, title: string }[]>();
    
    const [error, setError] = useState("");
    
    
    async function insertExpense() {
        try {
            if (paymentMethod) {
                const toInsert = {
                    title,
                    description,
                    amount,
                    date: date.toLocaleDateString("en-CA"),
                    paymentMethod,
                    category: categoryId
                };
                
                await createExpense(toInsert);
            }
        } catch (e) {
            setError("Erro ao inserir despesa!");
        }
    }
    
    useEffect(() => {
        async function updateCategoriesOptions() {
            try {
                const categories = await listCategories();
                setCategoryOptions(categories.map(category => ({ value: category.id, title: category.title })));
            } catch (e) {
                setError("Erro ao buscar categorias!");
            }
        }
        
        updateCategoriesOptions();
    }, []);
    
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-900 bg-black/60 flex items-center justify-center" onClick={onClose}>
            <div className="flex flex-col gap-4 bg-white p-6 rounded w-4xl" onClick={(event) => event.stopPropagation()}>
                <div className="flex flex-row justify-between">
                    <h1 className="mb-4">Adicionar despesa</h1>
                    <X
                        onClick={onClose}
                        className="cursor-pointer"
                    />
                </div>
                <Input
                    type="text"
                    label="Título"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); setError(""); }}
                />

                <Input
                    type="text"
                    label="Descrição"
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); setError(""); }}
                />

                <div className="flex flex-row gap-6">
                    <Input
                        type="number"
                        label="Valor (R$)"
                        value={amount}
                        onChange={(e) => { setAmount(Number(e.target.value)); setError(""); }}
                    />

                    <Input
                        type="date"
                        label="Data da despesa"
                        value={date.toLocaleDateString("en-CA")}
                        onChange={(e) => { setDate(new Date(e.target.value + "T00:00:00")) }}
                    />

                </div>

                <div className="flex flex-row gap-6">
                    <Select
                        label="Forma de pagamento"
                        options={[
                            { value: "CREDIT", title: "Crédito" },
                            { value: "DEBIT", title: "Débito" },
                            { value: "VOUCHER", title: "Vale" }
                        ]}
                        onChange={(e) => { 
                            const acceptableValues = [PaymentMethod.CREDIT, PaymentMethod.DEBIT, PaymentMethod.VOUCHER];
                            const value = acceptableValues.find(value => e.target.value === value);

                            if (value) {
                                setPaymentMethod(value);
                            }

                            setError(""); 
                        }}
                    />

                    <Select
                        label="Categoria"
                        options={categoryOptions}
                        onChange={(e) => { setCategoryId(e.target.value); setError(""); }}
                    />
                </div>

                <div className="flex flex-row gap-x-3 mt-6">
                    <Button
                        onClick={insertExpense}
                    >Cadastrar despesa</Button>
                    {/* <Button>Cadastrar</Button> */}
                </div>
                {error ? (
                    <span className="text-red-500 text-sm">{error}</span>
                ) : null}
            </div>
        </div>
    );
}