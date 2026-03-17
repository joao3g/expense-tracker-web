export type Expense = {
    title: string
    description?: string
    amount: string
    date: Date
    paymentMethod: 'CREDIT' | 'DEBIT' | 'VOUCHER'
    category: {
        id: string
        title: string
        description?: string
        groupId: string
        createdAt: Date
        updatedAt: Date
    },
    createdAt: Date
}

export type ExpenseSummarized = {
    summarizedByTitle: {
        _sum: { amount: string },
        title: string
    }[],
    summarizedByCategory: {
        _sum: { amount: string },
        categoryId: string,
        categoryTitle: string,
        categoryColor: string
    }[]
}

export type ExpenseTotal = {
    _sum: { amount: string },
}