import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storeKeys } from "../../../lib/marketQueryKeys";
import { storesApi } from "../services/storesApi";
import { toastNotification } from "@/components/custom/ToastNotification";

export const useStoreQuery = () => {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: storeKeys.all,
    queryFn: storesApi.getStores,
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
    mutationFn: (formData: FormData) => storesApi.createStore(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.all });
      toastNotification.success("Success!", "Store created successfully!");
    },
    onError: (error) => {
      toastNotification.error(
        "Error",
        error instanceof Error ? error.message : "Failed to create Store"
      );
    },
  });

  return createStoreMutation;
};

export const useUpdateStoreMutation = () => {
  const queryClient = useQueryClient();

  const updateStoreMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      storesApi.updateStore(id, formData),

    onSuccess: (_data, variables) => {
      const { id } = variables;
      queryClient.invalidateQueries({ queryKey: storeKeys.singleStore(id) });
      toastNotification.success("Success!", "Store updated successfully!");
    },
    onError: (error) => {
      toastNotification.error(
        "Error",
        error instanceof Error ? error.message : "Failed to update Store"
      );
    },
  });

  return updateStoreMutation;
};

export const useStoreDetailsQuery = (
  id: number,
  { enabled }: { enabled: boolean }
) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: storeKeys.singleStore(id),
    queryFn: () => storesApi.getStoreDetails(id),
    enabled: enabled,
  });

  return { storeDetails: data, isLoading, isError, error };
};

export const useDeleteStoreMutation = () => {
  const queryClient = useQueryClient();

  const deleteStoreMutation = useMutation({
    mutationFn: ({ id }: { id: number }) => storesApi.deleteStore(id),

    onSuccess: (_data, variables) => {
      const { id } = variables;
      queryClient.invalidateQueries({ queryKey: storeKeys.singleStore(id) });
      toastNotification.success("Success!", "Store deleted successfully!");
    },
    onError: (error) => {
      toastNotification.error(
        "Error",
        error instanceof Error ? error.message : "Failed to delete Store"
      );
    },
  });

  return deleteStoreMutation;
};
