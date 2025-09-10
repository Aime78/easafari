import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryKeys, subCategoryKeys } from "../../../lib/marketQueryKeys";
import { categoriesApi } from "../services/categoryApi";

export const useCategoryQuery = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: categoryKeys.all,
    queryFn: categoriesApi.getMyCategories,
  });

  return { myCategories: data || [], isLoading, isError, error };
};

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  const createCategoryMutation = useMutation({
    mutationFn: (formData: FormData) => categoriesApi.createCategory(formData),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
  });
  return createCategoryMutation;
};

export const useSubCategoryQuery = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: subCategoryKeys.all,
    queryFn: categoriesApi.getMySubCategories,
  });

  return { mySubCategories: data || [], isLoading, isError, error };
};

export const useCreateSubCategoryMutation = () => {
  const queryClient = useQueryClient();

  const createSubCategoryMutation = useMutation({
    mutationFn: (formData: FormData) =>
      categoriesApi.createSubCategories(formData),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: subCategoryKeys.all }),
  });
  return createSubCategoryMutation;
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      categoriesApi.updateCategory(id, formData),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
  });

  return updateCategoryMutation;
};

export const useUpdateSubCategoryMutation = () => {
  const queryClient = useQueryClient();

  const updateSubCategoryMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      categoriesApi.updateSubCategory(id, formData),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
  });

  return updateSubCategoryMutation;
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => categoriesApi.deleteCategory(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
  });

  return deleteCategoryMutation;
};

export const useDeleteSubCategoryMutation = () => {
  const queryClient = useQueryClient();

  const deleteSubCategoryMutation = useMutation({
    mutationFn: (id: number) => categoriesApi.deleteSubCategory(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
  });

  return deleteSubCategoryMutation;
};
