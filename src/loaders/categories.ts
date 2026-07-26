import { redirect } from "react-router";
import { authMiddleware } from "./auth";
import { categoriesQuery } from "../queries/categories";
import type { QueryClient } from "@tanstack/react-query";

export const categoriesLoader = (queryClient: QueryClient) =>
    async () => {
        try {
            authMiddleware();

            return {
                categories: await queryClient.ensureQueryData(categoriesQuery())
            };
        } catch (e) {
            if (e instanceof Response) {
                throw e;
            }

            throw redirect("/error");
        }
    }