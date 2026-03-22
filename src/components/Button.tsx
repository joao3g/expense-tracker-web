export type ButtonProps = {
    children: string
    color: ("emerald" | "green" | "red")
    onClick: React.MouseEventHandler
}

export function Button(props: ButtonProps) {
    function getClass() {
        if (props.color === "green") return "px-6 py-2 text-white bg-green-700 font-semibold rounded hover:bg-green-600 cursor-pointer";
        if (props.color === "emerald") return "px-6 py-2 text-white bg-emerald-700 font-semibold rounded hover:bg-emerald-600 cursor-pointer";
        return "px-6 py-2 text-white bg-red-700 font-semibold rounded hover:bg-red-600 cursor-pointer";
    }

    return (
        <button
            className={getClass()}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    )
}