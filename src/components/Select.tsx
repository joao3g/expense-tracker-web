interface CustomInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string
    options?: { value: string, title: string }[]
}

export function Select(props: CustomInputProps) {
    return (
        <div className="flex flex-col gap-y-1 flex-1">
            <label className="text-gray-700 text-sm">{props.label}</label>
            <select
                {...props}
                className="px-4 py-2 bg-gray-50 text-gray-600 rounded hover:bg-gray-200 focus:outline-1 outline-green-400"
            >
                {
                    props.options?.map((option, index) => {
                        return <option key={index} value={option.value}>{option.title}</option>
                    })
                }
            </select>
        </div>
    )
}