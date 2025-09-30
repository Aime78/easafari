//todo createProduct tanstack make some keys and
//hook for querying and hook for retrieving

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productKeys } from "../../../lib/marketQueryKeys";
import { productsApi } from "../services/productApi";
import { toastNotification } from "@/components/custom/ToastNotification";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const createProductMutation = useMutation({
    mutationFn: (formData: FormData) => productsApi.createProduct(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toastNotification.success("Success!", "Product created successfully!");
    },
    onError: (error) => {
      toastNotification.error(
        "Error",
        error instanceof Error ? error.message : "Failed to create Product"
      );
    },
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

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  const updateProductMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      productsApi.updateProduct(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toastNotification.success("Success!", "Product updated successfully!");
    },
    onError: (error) => {
      toastNotification.error(
        "Error",
        error instanceof Error ? error.message : "Failed to updated Product"
      );
    },
  });

  return updateProductMutation;
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => productsApi.deleteProduct(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toastNotification.success("Success!", "Product deleted successfully!");
    },
    onError: (error) => {
      toastNotification.error(
        "Error",
        error instanceof Error ? error.message : "Failed to deleted Product"
      );
    },
  });

  return deleteProductMutation;
};

export const useSingleProductQuery = (id: number) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: productKeys.singleProduct(id),
    queryFn: () => productsApi.getSingleProduct(id),
    enabled: !!id,
  });

  return {
    productDetails: data?.product,
    similarProducts: data?.similar ?? [],
    isLoading,
    isError,
    error,
  };
};

export const useGetProductsByCategoryQuery = (id: number) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: productKeys.productsByCategory(id),
    queryFn: () => productsApi.getProductsByCategory(id),
  });

  return {
    productsByCategory: data || [],
    isLoading,
    isError,
    error,
  };
};

export const useGetProductsBySubCategoryQuery = (id: number) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: productKeys.productsBySubCategory(id),
    queryFn: () => productsApi.getProductsBySubCategory(id),
  });

  return {
    productsBySubCategory: data || [],
    isLoading,
    isError,
    error,
  };
};
