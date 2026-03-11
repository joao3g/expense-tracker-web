export function Button({ children, onClick }: { children: string, onClick: React.MouseEventHandler<HTMLButtonElement> }) {
    return (
        <button
            className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-600 cursor-pointer"
            onClick={onClick}
        >
            {children}
        </button>
    )
}