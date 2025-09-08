import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { marketApi } from "../services/marketApi";
import { storeKeys } from "./queryKeys";

export const useStoreQuery = () => {
  // Query for fetching stores
  const { data, isLoading, error, isError } = useQuery({
    queryKey: storeKeys.all,
    queryFn: marketApi.getStores,
  });

  return {
    stores: data || [],
    isLoading,
    error,
    isError,
  };
};

export const useCreateStoreMutation = () => {
  const queryClient = useQueryClient();

  const createStoreMutation = useMutation({
    mutationFn: (formData: FormData) => marketApi.createStore(formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: storeKeys.all }),
  });

  return createStoreMutation;
};
