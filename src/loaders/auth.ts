import { redirect } from "react-router";

export const authMiddleware = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw redirect("/");
    }

    return null;
}