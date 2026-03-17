export type User = {
    login: string
    name: string
    email: string
}

export type LoginResponse = {
    token: string,
    user: User
}