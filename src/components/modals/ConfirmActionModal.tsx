import { X } from "lucide-react";
import { Button, type ButtonProps } from "../Button";
import type { JSX } from "react";

type ConfirmActionProps = {
    open: boolean
    title: string
    description: JSX.Element
    color: ButtonProps["color"]
    onSuccess: React.MouseEventHandler
    onClose: React.MouseEventHandler
}

export default function Main(props: ConfirmActionProps) {
    return props.open ? (
        <div className="fixed inset-0 z-900 bg-black/60 flex items-center justify-center" onClick={props.onClose}>
            <div className="flex flex-col gap-4 bg-white p-6 rounded w-xl" onClick={(event) => event.stopPropagation()}>
                <div className="flex flex-row justify-between">
                    <div></div>
                    <h1 className="text-xl font-semibold mb-4">{props.title}</h1>
                    <X
                        onClick={props.onClose}
                        className="cursor-pointer"
                    />
                </div>
            
                <span className="w-full text-center text-md">{props.description}</span>

                <div className="flex flex-row justify-center gap-x-3 mt-4">
                    <Button
                        color={props.color}
                        onClick={props.onSuccess}
                    >Confirmar</Button>
                </div>
            </div>
        </div>
    ) : null;
}