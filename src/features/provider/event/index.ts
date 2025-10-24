// Provider Event Module Exports

// Components
export { default as ProviderEventTable } from "./components/ProviderEventTable";
export { default as EventTableSkeleton } from "./components/EventTableSkeleton";
export { default as AddProviderEventDialog } from "./components/AddProviderEventDialog";
export { default as EditProviderEventDialog } from "./components/EditProviderEventDialog";
export { default as DeleteProviderEventDialog } from "./components/DeleteProviderEventDialog";

// Pages
export { default as ProviderEventsPage } from "./pages/ProviderEventsPage";
export { default as ProviderEventDetailsPage } from "./pages/ProviderEventDetailsPage";

// Hooks
export {
  useProviderEvents,
  useProviderEvent,
  useCreateProviderEvent,
  useUpdateProviderEvent,
  useDeleteProviderEvent,
  useProviderEventCategories,
  useProviderAttractions,
} from "./hooks/useProviderEvent";

// Services
export { providerEventService } from "./services/eventService";

// Types
export type {
  Event,
  EventDetails,
  EventDetailsResponse,
  EventCategory,
  Attraction,
  TourProvider,
  Review,
  CreateEventData,
  EventSearchParams,
  ApiError,
  ApiErrorResponse,
} from "./types/eventTypes";
