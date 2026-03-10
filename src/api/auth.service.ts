import { api } from "./client";

export const login = async (login: string, password: string) => {
    const { data } = await api.post("/auth/login", {
        login,
        password,
    });

    return data;
};

export const register = async (requestData: { login: string, password: string, name: string, email: string }) => {
    const { data } = await api.post("/auth/login", requestData);

    return data;
};