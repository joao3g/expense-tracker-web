interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export function Input(props: CustomInputProps) {
    return (
        <div className="flex flex-col gap-y-1 flex-1 w-full">
            <label className="text-sm font-[500]">{props.label}</label>
            <input
                {...props}
                className="px-4 py-3 bg-white rounded-full shadow-black-100 shadow-sm/10 inset-shadow-sm text-sm focus:outline-1 focus:outline-emerald-600"
            />
        </div>
    )
}