import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { TreePine, Landmark, Mountain, Camera, MapPin } from "lucide-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function categoryToSlug(categoryName: string): string {
  return categoryName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function getCategoryIcon(categoryName: string) {
  const name = categoryName.toLowerCase();
  
  if (name.includes('park') || name.includes('national')) {
    return TreePine;
  } else if (name.includes('cultural') || name.includes('heritage') || name.includes('historic')) {
    return Landmark;
  } else if (name.includes('mountain') || name.includes('hill')) {
    return Mountain;
  } else if (name.includes('experience') || name.includes('activity')) {
    return Camera;
  } else {
    return MapPin;
  }
}
