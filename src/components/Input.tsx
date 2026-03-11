interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export function Input(props: CustomInputProps) {
    return (
        <div className="flex flex-col gap-y-1">
            <label className="text-gray-700 text-sm">{props.label}</label>
            <input
                {...props}
                className="px-4 py-2 bg-gray-50 text-gray-600 rounded hover:bg-gray-200 focus:outline-1 outline-green-400"
            />
        </div>
    )
}