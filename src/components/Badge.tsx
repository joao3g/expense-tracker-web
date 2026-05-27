import { hexToHsl } from "../utils";

type BadgeVariants =
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "default"

type BadgeProps = {
    children: React.ReactNode
    color?: string
    variant?: BadgeVariants
}

const variants = {
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    default: "bg-gray-100 text-gray-700"
}

export function Badge(props: BadgeProps) {
    return (
        <div
            className={`
                inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                ${props.variant ? variants[props.variant] : undefined}
            `}
            style={props.color ? { backgroundColor: props.color, color: generateTextColor(props.color) } : undefined}
        >
            {props.children}
        </div>
    )
}

function generateTextColor(background: string) {
    const { h, s } = hexToHsl(background)

    return `hsl(${h}, ${Math.min(s + 10, 100)}%, 20%)`
}