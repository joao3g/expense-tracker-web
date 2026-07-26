export function LoadingSkeleton(props: { className?: string }) {
    return (
        <div className={`flex animate-pulse w-full max-w-sm rounded-xl ${props.className}`}>
            <div className="w-full rounded-lg bg-gray-400/40" />
        </div>
    )
}