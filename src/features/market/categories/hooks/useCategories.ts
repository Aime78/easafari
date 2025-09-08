import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { marketApi } from "../services/marketApi";
import { categoryKeys, subCategoryKeys } from "./queryKeys";

export const useCategoryQuery = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: categoryKeys.all,
    queryFn: marketApi.getMyCategories,
  });

  return { myCategories: data || [], isLoading, isError, error };
};

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  const createCategoryMutation = useMutation({
    mutationFn: (formData: FormData) => marketApi.createCategory(formData),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
  });
  return createCategoryMutation;
};

export const useSubCategoryQuery = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: subCategoryKeys.all,
    queryFn: marketApi.getMySubCategories,
  });

  return { mySubCategories: data || [], isLoading, isError, error };
};

export const useCreateSubCategoryMutation = () => {
  const queryClient = useQueryClient();

  const createSubCategoryMutation = useMutation({
    mutationFn: (formData: FormData) => marketApi.createSubCategories(formData),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: subCategoryKeys.all }),
  });
  return createSubCategoryMutation;
};
