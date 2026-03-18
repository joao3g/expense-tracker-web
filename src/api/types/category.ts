export type Category = {
    id: string
    title: string
    description: string
    color: string
    createdAt: Date
    group: {
        id: string
        title: string
    }
}