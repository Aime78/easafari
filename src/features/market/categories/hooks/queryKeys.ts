export const categoryKeys = {
  all: ["categories"] as const,
  singleCategory: (id: number) => [...categoryKeys.all, id] as const,
};

export const subCategoryKeys = {
  all: ["subcategories"] as const,
  singleSubCategory: (id: number) => [...subCategoryKeys.all, id] as const,
};

export const storeKeys = {
  all: ["stores"] as const,
  singleStore: (id: number) => [...storeKeys.all, id] as const,
};

export const productKeys = {
  all: ["products"] as const,
  singleProduct: (id: number) => [...productKeys.all, id] as const,
};
