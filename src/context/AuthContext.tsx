import { createContext, useState, type ReactNode } from "react"
import { type User } from "../api/types/auth.ts"

type AuthContextType = {
    user: User | null
    login: (token: string, user: User) => void
    logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    function login(token: string, user: User) {
        setUser(user);

        localStorage.setItem("token", token);
    }

    function logout() {
        setUser(null);

        localStorage.removeItem("token");
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}