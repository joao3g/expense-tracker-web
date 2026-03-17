export function Card({
    title,
    metric,
    description,
    bgColor
}: {
    title: string,
    metric: string,
    description: string,
    bgColor: "green" | "red" | "teal"
}) {
    const gradientMap = {
        green: "from-green-300 to-green-400",
        red: "from-red-300 to-red-400",
        teal: "from-teal-300 to-teal-400"
    }

    return (
        <div
            className={`flex flex-col px-8 gap-4 justify-center py-4 bg-linear-to-br ${gradientMap[bgColor]} text-gray-700 rounded-2xl`}
        >
            <span
                className="font-semibold text-lg"
            >
                {title}
            </span>

            <span
                className="font-bold text-3xl"            
            >
                {metric}
            </span>

            <span
                className="font-semibold text-lg"
            >
                {description}
            </span>
        </div>
    )
}