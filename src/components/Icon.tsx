import { Wallet } from "lucide-react";

export function Icon(props: { size: number }) {
    return (
        <div
            className={`inline-flex items-center justify-center rounded-full size-9 text-xs font-medium bg-linear-300 from-emerald-800/70 to-green-600/90 text-white shadow-green-600/20 shadow-lg`}
        >
            <Wallet size={props.size} strokeWidth={2.3} />
        </div>
    )
}