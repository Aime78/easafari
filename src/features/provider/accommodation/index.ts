// Provider Accommodation Module Exports

// Components
export { default as ProviderAccommodationTable } from "./components/ProviderAccommodationTable";
export { AddProviderAccommodationDialog } from "./components/AddProviderAccommodationDialog";
export { DeleteProviderAccommodationDialog } from "./components/DeleteProviderAccommodationDialog";

// Pages
export { default as ProviderAccommodationsPage } from "./pages/ProviderAccommodationsPage";

// Hooks
export {
  useProviderAccommodations,
  useProviderAccommodation,
  useCreateProviderAccommodation,
  useUpdateProviderAccommodation,
  useDeleteProviderAccommodation,
  useProviderAccommodationCategories,
  useProviderAttractions,
} from "./hooks/useProviderAccommodation";

// Services
export { providerAccommodationService } from "./services/accommodationService";

// Types
export type {
  Accommodation,
  AccommodationCategory,
  Attraction,
  CreateAccommodationData,
  AccommodationSearchParams,
  ApiError,
  ApiErrorResponse,
} from "./types/accommodationTypes";

// Schemas
export {
  createProviderAccommodationSchema,
  createProviderAccommodationCategorySchema,
} from "./schemas/providerAccommodationSchemas";
