import { TriangleAlert, X } from "lucide-react";
import { Button, type ButtonProps } from "../Button";

type ConfirmActionProps = {
    title: string
    description: string
    onDelete: React.MouseEventHandler
    onClose: React.MouseEventHandler
}

export default function Main(props: ConfirmActionProps) {
    return (
        <div className="fixed inset-0 z-900 bg-black/60 flex items-center justify-center" onClick={props.onClose}>
            <div className="flex flex-col bg-white p-6 rounded-2xl w-md" onClick={(event) => event.stopPropagation()}>
                <div className="flex flex-row justify-between">
                    <div className="flex justify-center items-center size-12 rounded-full bg-red-100/50 text-red-500">
                        <TriangleAlert size={20} />
                    </div>
                    <X
                        onClick={props.onClose}
                        className="cursor-pointer"
                    />
                </div>

                <h1 className="text-lg font-[600] mt-4">{props.title}</h1>

                <span className="w-full text-justify text-sm text-neutral-600">{props.description}</span>

                <div className="flex flex-row justify-end gap-x-3 mt-4">
                    <div>
                        <Button
                            variant="secondary"
                            onClick={props.onClose}
                        >Cancelar</Button>
                    </div>

                    <div>
                        <Button
                            variant="danger"
                            onClick={props.onDelete}
                        >Deletar</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}