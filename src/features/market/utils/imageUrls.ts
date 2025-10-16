export const getImageUrl = (imagePath: string) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const imageBase = baseURL.replace(/\/api\/?$/, "");

  return `${imageBase}/${imagePath}`;
};
