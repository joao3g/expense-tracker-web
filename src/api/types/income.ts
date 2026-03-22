export type IncomeCreate = {
    title: string
    amount: number
    date: string
}

export type Income = {
    id: string
    title: string
    amount: string
    date: Date
    group: {
        id: string
        title: string
    }
    user: {
        id: string
        name: string
        email: string
    },
    createdAt: Date
}

export type IncomeUpdate = {
    id: string
    title?: string
    amount?: number
    date?: string
}

export type IncomeTotal = {
    _sum: { amount: string },
}