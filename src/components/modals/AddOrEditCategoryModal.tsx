import { useState } from "react";
import { Input } from "../Input";
import { Button } from "../Button";
import { Check, X } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { createCategory, updateCategory } from "../../api/services/category.service";
import type { Category } from "../../api/types/category";
import { CategoryIcon } from "../Icon";

type AddOrEditCategoryModalProps = {
    onClose: React.MouseEventHandler
    onSuccess: React.MouseEventHandler
    data?: Category
}

export function AddOrEditCategoryModal(props: AddOrEditCategoryModalProps) {

    const [title, setTitle] = useState(props.data?.title || "");
    const [description, setDescription] = useState(props.data?.description || "");
    const [color, setColor] = useState(props.data?.color || "");

    const { addToast } = useToast();

    async function insertOrUpdateCategory(e: React.MouseEvent) {
        try {
            const data = {
                title,
                description,
                color
            };

            if (props.data) {
                await updateCategory({ id: props.data.id, ...data });
                addToast("Categoria editada com sucesso!", "info");
            }
            else {
                await createCategory(data);
                addToast("Categoria criada com sucesso!", "info");
            }

            props.onSuccess(e);
        } catch (e) {
            if (props.data) addToast("Erro ao editar categoria!", "error");
            else addToast("Erro ao inserir categoria!", "error");
        }
    }

    return (
        <div className="fixed inset-0 z-900 bg-black/60 flex items-center justify-center" onClick={props.onClose}>
            <div className="flex flex-col gap-4 bg-white p-6 rounded-2xl w-xl" onClick={(event) => event.stopPropagation()}>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <span className="text-xl font-[600]">
                            {props.data ? "Editar categoria" : "Nova categoria"}
                        </span>
                        <span className="text-xs text-neutral-600">
                            Separe as suas despesas por categorias — cores facilitam o entendimento.
                        </span>
                    </div>
                    <X
                        onClick={props.onClose}
                        className="cursor-pointer"
                    />
                </div>

                <Input
                    type="text"
                    label="Título"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); }}
                    placeholder="Ex.: Compras"
                />

                <Input
                    type="text"
                    label="Descrição"
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); }}
                />

                <div className="flex flex-col gap-2">
                    <span className="font-[500] text-sm">Cor</span>
                    <div className="flex flex-col gap-4 items-center w-full">
                        <div className="flex items-center justify-around w-full">
                            <div className={`flex justify-center items-center cursor-pointer rounded-full size-10 bg-[#009A4D] ${color === "009A4D" ? "border-2" : null}`} onClick={() => setColor("009A4D")}> 
                                {color === "009A4D" ? <Check size={18} color="white" /> : null}
                            </div>

                            <div className={`flex justify-center items-center cursor-pointer rounded-full size-10 bg-[#00B5B5] ${color === "00B5B5" ? "border-2" : null}`} onClick={() => setColor("00B5B5")}> 
                                {color === "00B5B5" ? <Check size={18} color="white" /> : null}
                            </div>

                            <div className={`flex justify-center items-center cursor-pointer rounded-full size-10 bg-[#C37F00] ${color === "C37F00" ? "border-2" : null}`} onClick={() => setColor("C37F00")}> 
                                {color === "C37F00" ? <Check size={18} color="white" /> : null}
                            </div>

                            <div className={`flex justify-center items-center cursor-pointer rounded-full size-10 bg-[#796AE5] ${color === "796AE5" ? "border-2" : null}`} onClick={() => setColor("796AE5")}> 
                                {color === "796AE5" ? <Check size={18} color="white" /> : null}
                            </div>

                            <div className={`flex justify-center items-center cursor-pointer rounded-full size-10 bg-[#F14D4C] ${color === "F14D4C" ? "border-2" : null}`} onClick={() => setColor("F14D4C")}> 
                                {color === "F14D4C" ? <Check size={18} color="white" /> : null}
                            </div>

                            <div className={`flex justify-center items-center cursor-pointer rounded-full size-10 bg-[#C282D0] ${color === "C282D0" ? "border-2" : null}`} onClick={() => setColor("C282D0")}> 
                                {color === "C282D0" ? <Check size={18} color="white" /> : null}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col gap-2">
                    <span className="font-[500] text-sm">Preview</span>
                    <div className="flex justify-between items-center w-full p-4 bg-slate-50/50 border-slate-200 border-1 rounded-3xl">
                        <div className="flex gap-2 items-center">
                            <CategoryIcon color={color} />

                            <div className="flex flex-col">
                                <span className="text-md font-[600]">
                                    {title || "Nome da categoria"}
                                </span>
                                <span className="text-[11px]/2 font-italic text-neutral-600">
                                    Quantidade de transações
                                </span>
                            </div>
                        </div>
                    </div>
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
                            onClick={(e) => insertOrUpdateCategory(e)}
                        >{props.data ? "Editar categoria" : "Cadastrar categoria"}</Button>
                    </div>
                    {/* <Button>Cadastrar</Button> */}
                </div>
            </div>
        </div>
    );
}