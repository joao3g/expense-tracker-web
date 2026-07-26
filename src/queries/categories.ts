import * as categoryService from "../api/services/category.service";

export const categoriesQuery = () => ({
    queryKey: ['categories'],
    queryFn: async () => categoryService.listCategories(),
});