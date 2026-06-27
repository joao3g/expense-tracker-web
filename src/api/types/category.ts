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

export type CategoryUpdate = {
    id: string
    title?: string
    description?: string
    color?: string
}

export type CategoryCreate = {
    title: string
    description: string
    color: string
}