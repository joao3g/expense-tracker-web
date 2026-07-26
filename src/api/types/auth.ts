export type User = {
    login: string
    name: string
    email: string,
    group: {
        title: string
        totalMembers: number
    }
}

export type LoginResponse = {
    token: string,
    user: User
}