export const PaymentMethod = {
    CREDIT: "CREDIT",
    DEBIT: "DEBIT",
    VOUCHER: "VOUCHER"
} as const;

export type ExpenseCreate = {
    title: string
    description?: string
    amount: number
    date: string
    paymentMethod: typeof PaymentMethod[keyof typeof PaymentMethod]
    category: string
}

export type ExpenseUpdate = {
    id: string
    title?: string
    description?: string
    amount?: number
    date?: string
    paymentMethod?: typeof PaymentMethod[keyof typeof PaymentMethod]
    category?: string
}

export type Expense = {
    id: string
    title: string
    description?: string
    amount: string
    transactionDate: string
    dueDate: string
    paymentMethod: typeof PaymentMethod[keyof typeof PaymentMethod]
    isEssential?: boolean
    category: {
        id: string
        title: string
        description?: string
        color: string
        groupId: string
        createdAt: string
        updatedAt: string
    },
    createdAt: string
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
    }[],
    summarizedByPaymentMethod: {
        _sum: { amount: string },
        paymentMethod: typeof PaymentMethod[keyof typeof PaymentMethod]
    }[]
}

export type ExpenseTotal = {
    _sum: { amount: string },
}