// Types
export type * from "./types/accommodationTypes";

// Schemas
export {
  createAccommodationSchema,
  createCategorySchema,
} from "./schemas/accommodationSchemas";

// Services
export { accommodationService } from "./services/accommodationService";

// Hooks
export {
  useAccommodations,
  useAccommodation,
  useCreateAccommodation,
  useAccommodationCategories,
} from "./hooks/useAccommodation";

// Components
export { AddAccommodationDialog } from "./components/AddAccommodationDialog";
export { default as AccommodationTable } from "./components/AccommodationTable";

// Pages
export { default as AccommodationsPage } from "./pages/AccommodationsPage";
