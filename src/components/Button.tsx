type ButtonVariants =
    | "primary"
    | "secondary"

export type ButtonProps = {
    children: React.ReactNode
    variant: ButtonVariants
    onClick: React.MouseEventHandler
    disabled?: boolean
}

const variants = {
    primary: "px-4 py-2 text-white bg-linear-to-r from-green-600/90 via-emerald-700/90 via-60% to-emerald-700 hover:opacity-95 font-normal text-md shadow-emerald-100 shadow-lg",
    secondary: "px-4 py-2 text-black bg-white font-normal text-md shadow-black-100 shadow-sm/20 inset-shadow-sm hover:text-green-900 hover:bg-green-100"
}

export function Button(props: ButtonProps) {
    return (
        <button
            className={`
                rounded-full cursor-pointer w-full
                ${props.variant ? variants[props.variant] : undefined}
            `}
            disabled={props.disabled}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    )
}