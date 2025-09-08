//todo createProduct tanstack make some keys and
//hook for querying and hook for retrieving

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productKeys } from "../../../lib/queryKeys";
import { productsApi } from "../services/productApi";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const createProductMutation = useMutation({
    mutationFn: (formData: FormData) => productsApi.createProduct(formData),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productKeys.all }),
  });

  return createProductMutation;
};

export const useProductsQuery = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: productKeys.all,
    queryFn: () => productsApi.getAllProducts(),
  });

  return { products: data || [], isLoading, isError, error };
};
