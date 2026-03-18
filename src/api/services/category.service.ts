import type { Category } from "../types/category";
import { api } from "./client";

export const listCategories = async () => {
    const { data } = await api.get<Category[]>("/category/list");

    return data;
};