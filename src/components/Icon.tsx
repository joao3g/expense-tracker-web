import { Tag, Wallet } from "lucide-react";
import { hexToHsl } from "../utils";

function getIconColor(color: string) {
    const { h, s } = hexToHsl(color);

    return `hsl(${h},${Math.min(s + 10, 100)}%,20%)`;
}

export function Icon(props: { size: number }) {
    return (
        <div
            className={`inline-flex items-center justify-center rounded-full size-9 text-xs font-medium bg-linear-300 from-emerald-800/70 to-green-600/90 text-white shadow-green-600/20 shadow-lg`}
        >
            <Wallet size={props.size} strokeWidth={2.3} />
        </div>
    )
}

export function CategoryIcon(props: { color: string }) {
    return (
        <div className="flex items-center justify-center size-10 rounded-full" style={{ backgroundColor: `#${props.color}` }}>
            <Tag size={18} color={getIconColor(props.color)} />
        </div>
    );
}