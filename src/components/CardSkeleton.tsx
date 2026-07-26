type CardProps = {
    children: React.ReactNode
    padding?: {
        top?: number
        right?: number
        bottom?: number
        left?: number
    }
}

export function CardSkeleton(props: CardProps) {
    return (
        <div 
            className="h-full gap-4 justify-center bg-linear-to-br text-gray-700 bg-white border-1 border-slate-200 rounded-2xl hover:shadow-lg"
            style={{ 
                paddingTop: props.padding?.top ?? 16,
                paddingRight: props.padding?.right ?? 24,
                paddingBottom: props.padding?.bottom ?? 16,
                paddingLeft: props.padding?.left ?? 24
            }}
        >
            {props.children}
        </div>
    )
}