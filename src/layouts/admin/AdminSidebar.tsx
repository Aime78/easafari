import {
  Home,
  Bed,
  MapPin,
  Camera,
  Car,
  Calendar,
  ChevronDown,
  ChevronRight,
  Plus,
  Save,
  ImageIcon,
  RotateCcw,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";
import { useAttractionCategories } from "@/features/admin/attraction";
import { useAccommodationCategories } from "@/features/admin/accommodation";
import { useExperienceCategories } from "@/features/admin/experience";
import { categoryToSlug, getCategoryIcon } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getImageUrl } from "@/lib/imageUtils";

const AdminSidebar = () => {
  const location = useLocation();
  const [isAttractionsExpanded, setIsAttractionsExpanded] = useState(false);
  const [isAccommodationsExpanded, setIsAccommodationsExpanded] =
    useState(false);
  const [isExperiencesExpanded, setIsExperiencesExpanded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAccommodationAddForm, setShowAccommodationAddForm] =
    useState(false);
  const [showExperienceAddForm, setShowExperienceAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newAttractionCategoryImage, setNewAttractionCategoryImage] =
    useState<File | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [newAccommodationCategoryName, setNewAccommodationCategoryName] =
    useState("");
  const [newAccommodationCategoryImage, setNewAccommodationCategoryImage] =
    useState<File | null>(null);
  const [newExperienceCategoryName, setNewExperienceCategoryName] =
    useState("");
  const [newExperienceCategoryImage, setNewExperienceCategoryImage] =
    useState<File | null>(null);
  const { categories, loading, createCategory, isCreating } =
    useAttractionCategories();
  const {
    categories: accommodationCategories,
    loading: accommodationLoading,
    createCategory: createAccommodationCategory,
    isCreating: isCreatingAccommodation,
  } = useAccommodationCategories();
  const {
    categories: experienceCategories,
    loading: experienceLoading,
    createCategory: createExperienceCategory,
    isCreating: isCreatingExperience,
  } = useExperienceCategories();

  // Ensure categories are arrays
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeAccommodationCategories = Array.isArray(accommodationCategories)
    ? accommodationCategories
    : [];
  const safeExperienceCategories = Array.isArray(experienceCategories)
    ? experienceCategories
    : [];

  useEffect(() => {
    if (location.pathname.startsWith("/admin/attractions/")) {
      setIsAttractionsExpanded(true);
    }
    if (location.pathname.startsWith("/admin/accommodations/")) {
      setIsAccommodationsExpanded(true);
    }
    if (location.pathname.startsWith("/admin/experiences/")) {
      setIsExperiencesExpanded(true);
    }
  }, [location.pathname]);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const formData = new FormData();
      formData.append("name", newCategoryName.trim());
      if (newAttractionCategoryImage) {
        formData.append("image", newAttractionCategoryImage);
      }

      createCategory(formData, {
        onSuccess: () => {
          setNewCategoryName("");
          setNewAttractionCategoryImage(null);
          setShowAddForm(false);
        },
      });
    }
  };

  const handleCancelAdd = () => {
    setNewCategoryName("");
    setNewAttractionCategoryImage(null);
    setShowAddForm(false);
  };

  const handleAddAccommodationCategory = () => {
    if (newAccommodationCategoryName.trim()) {
      const formData = new FormData();
      formData.append("name", newAccommodationCategoryName.trim());
      if (newAccommodationCategoryImage) {
        formData.append("thumbnail", newAccommodationCategoryImage);
      }

      createAccommodationCategory(formData, {
        onSuccess: () => {
          setNewAccommodationCategoryName("");
          setNewAccommodationCategoryImage(null);
          setShowAccommodationAddForm(false);
        },
      });
    }
  };

  const handleCancelAccommodationAdd = () => {
    setNewAccommodationCategoryName("");
    setNewAccommodationCategoryImage(null);
    setShowAccommodationAddForm(false);
  };

  const handleAddExperienceCategory = () => {
    if (newExperienceCategoryName.trim()) {
      const formData = new FormData();
      formData.append("name", newExperienceCategoryName.trim());
      if (newExperienceCategoryImage) {
        formData.append("thumbnail", newExperienceCategoryImage);
      }

      createExperienceCategory(formData, {
        onSuccess: () => {
          setNewExperienceCategoryName("");
          setNewExperienceCategoryImage(null);
          setShowExperienceAddForm(false);
        },
      });
    }
  };

  const handleCancelExperienceAdd = () => {
    setNewExperienceCategoryName("");
    setNewExperienceCategoryImage(null);
    setShowExperienceAddForm(false);
  };

  const handleImageError = (categoryId: string) => {
    console.log("Image failed to load for category:", categoryId);
    setImageErrors((prev) => new Set(prev).add(categoryId));
  };

  const retryImage = (categoryId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setImageErrors((prev) => {
      const newSet = new Set(prev);
      newSet.delete(categoryId);
      return newSet;
    });
  };

  const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `px-6 py-2 rounded-lg flex items-center gap-2 ${
      isActive
        ? "bg-primary text-white font-medium"
        : "text-black font-normal hover:bg-primary hover:text-white hover:font-medium"
    }`;

  return (
    <div className="bg-[#f6f8fc] flex flex-col">
      <div className="flex h-12 items-center gap-3 px-4 lg:h-[60px] lg:px-6 font-bold">
        <img
          src={logo}
          alt="Company Logo"
          className="w-20 h-20 object-contain"
        />
      </div>

      <div className="flex flex-col h-[calc(100vh-70px)] text-sm">
        <ScrollArea className="flex-1 h-[calc(100vh-120px)]">
          <nav className="flex flex-col gap-1 px-2 py-3">
            <NavLink to={"/admin"} end className={getLinkClassName}>
              <Home className="w-4 h-4" />
              <span>Overview</span>
            </NavLink>

            <div>
              <NavLink
                to={"/admin/accommodations"}
                onClick={() =>
                  setIsAccommodationsExpanded(!isAccommodationsExpanded)
                }
                className={() => {
                  const baseClasses =
                    "w-full px-6 py-2 rounded-lg flex items-center gap-2 text-left";

                  const isExactlyOnAccommodations =
                    location.pathname === "/admin/accommodations";

                  if (isExactlyOnAccommodations) {
                    return `${baseClasses} bg-primary text-white font-medium`;
                  } else if (isAccommodationsExpanded) {
                    return `${baseClasses} bg-primary/10 text-primary font-medium`;
                  } else {
                    return `${baseClasses} text-black font-normal hover:bg-primary hover:text-white hover:font-medium`;
                  }
                }}
              >
                <Bed className="w-4 h-4" />
                <span className="flex-1">Accommodation</span>
                {isAccommodationsExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </NavLink>

              {isAccommodationsExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {accommodationLoading ? (
                    <div className="px-4 py-2 text-gray-500 text-sm">
                      Loading categories...
                    </div>
                  ) : (
                    <>
                      {safeAccommodationCategories.map((category) => {
                        const IconComponent = getCategoryIcon(category.name);
                        const slug = categoryToSlug(category.name);

                        return (
                          <NavLink
                            key={category.id}
                            to={`/admin/accommodations/${slug}`}
                            className={({ isActive }) =>
                              `px-4 py-2 rounded-lg flex items-center gap-2 ${
                                isActive
                                  ? "bg-primary text-white font-medium"
                                  : "text-gray-600 font-normal hover:bg-primary hover:text-white hover:font-medium"
                              }`
                            }
                          >
                            {category.thumbnail &&
                            !imageErrors.has(`accommodation-${category.id}`) ? (
                              <img
                                src={getImageUrl(category.thumbnail)}
                                alt={category.name}
                                className="w-4 h-4 object-cover rounded"
                                onError={() =>
                                  handleImageError(
                                    `accommodation-${category.id}`
                                  )
                                }
                              />
                            ) : (
                              <div className="w-4 h-4 flex items-center justify-center group relative">
                                {imageErrors.has(
                                  `accommodation-${category.id}`
                                ) ? (
                                  <>
                                    <ImageIcon className="w-3 h-3 text-current" />
                                    <button
                                      onClick={(e) =>
                                        retryImage(
                                          `accommodation-${category.id}`,
                                          e
                                        )
                                      }
                                      className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center"
                                      title="Retry loading image"
                                    >
                                      <RotateCcw className="w-2 h-2 text-white" />
                                    </button>
                                  </>
                                ) : (
                                  <IconComponent className="w-4 h-4" />
                                )}
                              </div>
                            )}
                            <span>{category.name}</span>
                          </NavLink>
                        );
                      })}

                      {showAccommodationAddForm ? (
                        <div className="px-4 py-2 space-y-2">
                          <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-600 font-medium">
                              Name
                            </label>
                            <Input
                              type="text"
                              value={newAccommodationCategoryName}
                              onChange={(e) =>
                                setNewAccommodationCategoryName(e.target.value)
                              }
                              placeholder="Enter category name"
                              className="h-7 text-xs"
                              disabled={isCreatingAccommodation}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleAddAccommodationCategory();
                                } else if (e.key === "Escape") {
                                  handleCancelAccommodationAdd();
                                }
                              }}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-600 font-medium">
                              Image
                            </label>
                            <Input
                              type="file"
                              onChange={(e) =>
                                setNewAccommodationCategoryImage(
                                  e.target.files?.[0] || null
                                )
                              }
                              accept="image/*"
                              className="h-7 text-xs"
                              disabled={isCreatingAccommodation}
                            />
                            {newAccommodationCategoryImage && (
                              <div className="text-xs text-gray-500">
                                Selected: {newAccommodationCategoryImage.name}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={handleAddAccommodationCategory}
                              disabled={
                                isCreatingAccommodation ||
                                !newAccommodationCategoryName.trim()
                              }
                              className="h-6 px-2 text-xs"
                            >
                              {isCreatingAccommodation ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                              ) : (
                                <>
                                  <Save className="w-3 h-3 mr-1" />
                                  Save
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelAccommodationAdd}
                              disabled={isCreatingAccommodation}
                              className="h-6 px-2 text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowAccommodationAddForm(true)}
                          className="px-4 py-2 rounded-lg flex items-center gap-2 text-gray-600 font-normal hover:bg-primary hover:text-white hover:font-medium w-full text-left"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Category</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <div>
              <NavLink
                to={"/admin/attractions"}
                onClick={() => setIsAttractionsExpanded(!isAttractionsExpanded)}
                className={() => {
                  const baseClasses =
                    "w-full px-6 py-2 rounded-lg flex items-center gap-2 text-left";

                  const isExactlyOnAttractions =
                    location.pathname === "/admin/attractions";

                  if (isExactlyOnAttractions) {
                    return `${baseClasses} bg-primary text-white font-medium`;
                  } else if (isAttractionsExpanded) {
                    return `${baseClasses} bg-primary/10 text-primary font-medium`;
                  } else {
                    return `${baseClasses} text-black font-normal hover:bg-primary hover:text-white hover:font-medium`;
                  }
                }}
              >
                <MapPin className="w-4 h-4" />
                <span className="flex-1">Attractions</span>
                {isAttractionsExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </NavLink>

              {isAttractionsExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {loading ? (
                    <div className="px-4 py-2 text-gray-500 text-sm">
                      Loading categories...
                    </div>
                  ) : (
                    <>
                      {safeCategories.map((category) => {
                        const IconComponent = getCategoryIcon(category.name);
                        const slug = categoryToSlug(category.name);

                        return (
                          <NavLink
                            key={category.id}
                            to={`/admin/attractions/${slug}`}
                            className={({ isActive }) =>
                              `px-4 py-2 rounded-lg flex items-center gap-2 ${
                                isActive
                                  ? "bg-primary text-white font-medium"
                                  : "text-gray-600 font-normal hover:bg-primary hover:text-white hover:font-medium"
                              }`
                            }
                          >
                            {category.image &&
                            !imageErrors.has(`attraction-${category.id}`) ? (
                              <img
                                src={getImageUrl(category.image)}
                                alt={category.name}
                                className="w-4 h-4 object-cover rounded"
                                onError={() =>
                                  handleImageError(`attraction-${category.id}`)
                                }
                              />
                            ) : (
                              <div className="w-4 h-4 flex items-center justify-center group relative">
                                {imageErrors.has(
                                  `attraction-${category.id}`
                                ) ? (
                                  <>
                                    <ImageIcon className="w-3 h-3 text-current" />
                                    <button
                                      onClick={(e) =>
                                        retryImage(
                                          `attraction-${category.id}`,
                                          e
                                        )
                                      }
                                      className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center"
                                      title="Retry loading image"
                                    >
                                      <RotateCcw className="w-2 h-2 text-white" />
                                    </button>
                                  </>
                                ) : (
                                  <IconComponent className="w-4 h-4" />
                                )}
                              </div>
                            )}
                            <span>{category.name}</span>
                          </NavLink>
                        );
                      })}

                      {showAddForm ? (
                        <div className="px-4 py-2 space-y-2">
                          <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-600 font-medium">
                              Name
                            </label>
                            <Input
                              type="text"
                              value={newCategoryName}
                              onChange={(e) =>
                                setNewCategoryName(e.target.value)
                              }
                              placeholder="Enter category name"
                              className="h-7 text-xs"
                              disabled={isCreating}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleAddCategory();
                                } else if (e.key === "Escape") {
                                  handleCancelAdd();
                                }
                              }}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-600 font-medium">
                              Image
                            </label>
                            <Input
                              type="file"
                              onChange={(e) =>
                                setNewAttractionCategoryImage(
                                  e.target.files?.[0] || null
                                )
                              }
                              accept="image/*"
                              className="h-7 text-xs"
                              disabled={isCreating}
                            />
                            {newAttractionCategoryImage && (
                              <div className="text-xs text-gray-500">
                                Selected: {newAttractionCategoryImage.name}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={handleAddCategory}
                              disabled={isCreating || !newCategoryName.trim()}
                              className="h-6 px-2 text-xs"
                            >
                              {isCreating ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                              ) : (
                                <>
                                  <Save className="w-3 h-3 mr-1" />
                                  Save
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelAdd}
                              disabled={isCreating}
                              className="h-6 px-2 text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowAddForm(true)}
                          className="px-4 py-2 rounded-lg flex items-center gap-2 text-gray-600 font-normal hover:bg-primary hover:text-white hover:font-medium w-full text-left"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Category</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <div>
              <NavLink
                to={"/admin/experiences"}
                onClick={() => setIsExperiencesExpanded(!isExperiencesExpanded)}
                className={() => {
                  const baseClasses =
                    "w-full px-6 py-2 rounded-lg flex items-center gap-2 text-left";

                  const isExactlyOnExperiences =
                    location.pathname === "/admin/experiences";

                  if (isExactlyOnExperiences) {
                    return `${baseClasses} bg-primary text-white font-medium`;
                  } else if (isExperiencesExpanded) {
                    return `${baseClasses} bg-primary/10 text-primary font-medium`;
                  } else {
                    return `${baseClasses} text-black font-normal hover:bg-primary hover:text-white hover:font-medium`;
                  }
                }}
              >
                <Camera className="w-4 h-4" />
                <span className="flex-1">Experiences</span>
                {isExperiencesExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </NavLink>

              {isExperiencesExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {experienceLoading ? (
                    <div className="px-4 py-2 text-gray-500 text-sm">
                      Loading categories...
                    </div>
                  ) : (
                    <>
                      {safeExperienceCategories.map((category) => {
                        const IconComponent = getCategoryIcon(category.name);
                        const slug = categoryToSlug(category.name);

                        return (
                          <NavLink
                            key={category.id}
                            to={`/admin/experiences/${slug}`}
                            className={({ isActive }) =>
                              `px-4 py-2 rounded-lg flex items-center gap-2 ${
                                isActive
                                  ? "bg-primary text-white font-medium"
                                  : "text-gray-600 font-normal hover:bg-primary hover:text-white hover:font-medium"
                              }`
                            }
                          >
                            {category.thumbnail &&
                            !imageErrors.has(`experience-${category.id}`) ? (
                              <img
                                src={getImageUrl(category.thumbnail)}
                                alt={category.name}
                                className="w-4 h-4 object-cover rounded"
                                onError={() =>
                                  handleImageError(`experience-${category.id}`)
                                }
                              />
                            ) : (
                              <div className="w-4 h-4 flex items-center justify-center group relative">
                                {imageErrors.has(
                                  `experience-${category.id}`
                                ) ? (
                                  <>
                                    <ImageIcon className="w-3 h-3 text-current" />
                                    <button
                                      onClick={(e) =>
                                        retryImage(
                                          `experience-${category.id}`,
                                          e
                                        )
                                      }
                                      className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center"
                                      title="Retry loading image"
                                    >
                                      <RotateCcw className="w-2 h-2 text-white" />
                                    </button>
                                  </>
                                ) : (
                                  <IconComponent className="w-4 h-4" />
                                )}
                              </div>
                            )}
                            <span>{category.name}</span>
                          </NavLink>
                        );
                      })}

                      {showExperienceAddForm ? (
                        <div className="px-4 py-2 space-y-2">
                          <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-600 font-medium">
                              Name
                            </label>
                            <Input
                              type="text"
                              value={newExperienceCategoryName}
                              onChange={(e) =>
                                setNewExperienceCategoryName(e.target.value)
                              }
                              placeholder="Enter category name"
                              className="h-7 text-xs"
                              disabled={isCreatingExperience}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleAddExperienceCategory();
                                } else if (e.key === "Escape") {
                                  handleCancelExperienceAdd();
                                }
                              }}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-600 font-medium">
                              Image
                            </label>
                            <Input
                              type="file"
                              onChange={(e) =>
                                setNewExperienceCategoryImage(
                                  e.target.files?.[0] || null
                                )
                              }
                              accept="image/*"
                              className="h-7 text-xs"
                              disabled={isCreatingExperience}
                            />
                            {newExperienceCategoryImage && (
                              <div className="text-xs text-gray-500">
                                Selected: {newExperienceCategoryImage.name}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={handleAddExperienceCategory}
                              disabled={
                                isCreatingExperience ||
                                !newExperienceCategoryName.trim()
                              }
                              className="h-6 px-2 text-xs"
                            >
                              {isCreatingExperience ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                              ) : (
                                <>
                                  <Save className="w-3 h-3 mr-1" />
                                  Save
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelExperienceAdd}
                              disabled={isCreatingExperience}
                              className="h-6 px-2 text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowExperienceAddForm(true)}
                          className="px-4 py-2 rounded-lg flex items-center gap-2 text-gray-600 font-normal hover:bg-primary hover:text-white hover:font-medium w-full text-left"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Category</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <NavLink to={"/admin/tour-providers"} className={getLinkClassName}>
              <Car className="w-4 h-4" />
              Tour Providers
            </NavLink>

            <NavLink to={"/admin/events"} className={getLinkClassName}>
              <Calendar className="w-4 h-4" />
              Events
            </NavLink>
          </nav>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AdminSidebar;
