//todo createProduct tanstack make some keys and
//hook for querying and hook for retrieving

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { marketApi } from "../services/marketApi";
import { productKeys } from "./queryKeys";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const createProductMutation = useMutation({
    mutationFn: (formData: FormData) => marketApi.createProduct(formData),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productKeys.all }),
  });

  return createProductMutation;
};

export const useProductsQuery = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: productKeys.all,
    queryFn: () => marketApi.getAllProducts(),
  });

  return { products: data || [], isLoading, isError, error };
};
