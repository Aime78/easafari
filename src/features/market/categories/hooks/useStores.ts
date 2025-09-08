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

export const useUpdateStoreMutation = () => {
  const queryClient = useQueryClient();

  const updateStoreMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      marketApi.updateStore(id, formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: storeKeys.all }),
  });

  return updateStoreMutation;
};

export const useStoreDetailsQuery = (
  id: number,
  { enabled }: { enabled: boolean }
) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: storeKeys.singleStore(id),
    queryFn: () => marketApi.getStoreDetails(id),
    enabled: enabled,
  });

  return { storeDetails: data, isLoading, isError, error };
};

export const useDeleteStoreMutation = () => {
  const queryClient = useQueryClient();

  const deleteStoreMutation = useMutation({
    mutationFn: ({ id }: { id: number }) => marketApi.deleteStore(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: storeKeys.all }),
  });

  return deleteStoreMutation;
};
