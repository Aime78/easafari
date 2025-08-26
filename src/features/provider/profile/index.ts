// Pages
export { default as ProviderSettingsPage } from "./pages/ProviderSettingsPage";

// Services
export { providerService } from "./services/providerService";

// Hooks
export {
  useProviderProfile,
  useUpdateProviderProfile,
} from "./hooks/useProvider";

// Types
export type {
  ProviderProfile,
  ProviderProfileFormData,
  ApiErrorResponse,
} from "./types/providerTypes";

// Schemas
export {
  providerProfileSchema,
  // Backward compatibility
  providerSettingsSchema,
} from "./schemas/providerSchemas";
export type {
  ProviderProfileFormData as ProviderProfileFormDataSchema,
  // Backward compatibility
  ProviderSettingsFormData,
} from "./schemas/providerSchemas";
