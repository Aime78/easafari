// Central query key factory for consistent cache management
export const queryKeys = {
  // Attractions
  attractions: {
    all: ["attractions"] as const,
    lists: () => [...queryKeys.attractions.all, "list"] as const,
    list: (filters: string) =>
      [...queryKeys.attractions.lists(), { filters }] as const,
    details: () => [...queryKeys.attractions.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.attractions.details(), id] as const,
    search: (query: string) =>
      [...queryKeys.attractions.all, "search", query] as const,
  },

  // Accommodations
  accommodations: {
    all: ["accommodations"] as const,
    lists: () => [...queryKeys.accommodations.all, "list"] as const,
    list: (filters: string) =>
      [...queryKeys.accommodations.lists(), { filters }] as const,
    details: () => [...queryKeys.accommodations.all, "detail"] as const,
    detail: (id: string) =>
      [...queryKeys.accommodations.details(), id] as const,
    search: (query: string) =>
      [...queryKeys.accommodations.all, "search", query] as const,
  },

  // Experiences
  experiences: {
    all: ["experiences"] as const,
    lists: () => [...queryKeys.experiences.all, "list"] as const,
    list: (filters: string) =>
      [...queryKeys.experiences.lists(), { filters }] as const,
    details: () => [...queryKeys.experiences.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.experiences.details(), id] as const,
    search: (query: string) =>
      [...queryKeys.experiences.all, "search", query] as const,
  },

  // Categories
  categories: {
    attractions: {
      all: ["attraction-categories"] as const,
      lists: () => [...queryKeys.categories.attractions.all, "list"] as const,
    },
    accommodations: {
      all: ["accommodation-categories"] as const,
      lists: () =>
        [...queryKeys.categories.accommodations.all, "list"] as const,
    },
    experiences: {
      all: ["experience-categories"] as const,
      lists: () => [...queryKeys.categories.experiences.all, "list"] as const,
    },
  },

  // Provider
  provider: {
    all: ["provider"] as const,
    profile: () => [...queryKeys.provider.all, "profile"] as const,
    services: () => [...queryKeys.provider.all, "services"] as const,
    details: () => [...queryKeys.provider.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.provider.details(), id] as const,
    experiences: {
      all: ["provider", "experiences"] as const,
      lists: () => [...queryKeys.provider.experiences.all, "list"] as const,
      list: (filters: string) =>
        [...queryKeys.provider.experiences.lists(), { filters }] as const,
      details: () => [...queryKeys.provider.experiences.all, "detail"] as const,
      detail: (id: string) =>
        [...queryKeys.provider.experiences.details(), id] as const,
      search: (query: string) =>
        [...queryKeys.provider.experiences.all, "search", query] as const,
    },
  },
};
