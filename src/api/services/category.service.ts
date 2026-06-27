import type { Category, CategoryCreate, CategoryUpdate } from "../types/category";
import { api } from "./client";

export const createCategory = async (categoryData: CategoryCreate) => {
    await api.post<void>("/category/create", categoryData);
}

export const updateCategory = async (categoryData: CategoryUpdate) => {
    await api.patch<void>("/category/update", categoryData);
}

export const listCategories = async () => {
    const { data } = await api.get<Category[]>("/category/list");

    return data;
};

export const deleteCategory = async (categoryId: string) => {
    await api.delete<void>(`/category/delete/${categoryId}`);
}