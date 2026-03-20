import { createContext, useState, type ReactNode } from "react";

type ToastContextType = {
    addToast: (message: string, type?: "info" | "error" | "success") => void
}

export const ToastContext = createContext<ToastContextType | null>(null);

type Toast = {
    id: number
    message: string
    type: "info" | "error" | "success"
    isLeaving?: boolean
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>();

    const acceptableToastTypesColorMap = {
        info: "bg-teal-500 border-teal-600 border-2",
        error: "bg-red-400",
        success: "bg-green-400"
    };

    function addToast(message: string, type: "info" | "error" | "success" = "info") {
        const id = Date.now();

        setToasts((prev) => prev ? [...prev, { id, message, type }] : [{ id, message, type }]);

        setTimeout(() => {
            setToasts((prev) =>
                prev?.map((t) =>
                    t.id === id ? { ...t, isLeaving: true } : t
                )
            );
        }, 3000);

        setTimeout(() => {
            setToasts((prev) => prev?.filter(t => t.id !== id));
        }, 3500);
    }

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}

            <div className="fixed top-4 right-4 flex z-999 flex-col gap-2">
                {toasts?.map(t => (
                    <div
                        key={t.id}
                        className={`
                            px-6 py-4 rounded text-white transition-all duration-500
                            ${acceptableToastTypesColorMap[t.type]}
                            ${t.isLeaving ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}
                        `}
                    >
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}