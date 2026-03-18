import { createContext, useEffect, useState, type ReactNode } from "react"
import { type User } from "../api/types/auth.ts"
import { api } from "../api/services/client.ts"

type AuthContextType = {
    user: User | null
    login: (token: string, user: User) => void
    logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) return;

        async function loadUser() {
            try {
                const { data } = await api.get<User>("/auth/me");
                setUser(data);
            } catch {
                localStorage.removeItem("token");
                setUser(null);
            }
        }

        loadUser();
    }, []);

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