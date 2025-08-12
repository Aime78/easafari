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
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";
import { useAttractionCategories } from "@/hooks/useAttractionCategories";
import { useAccommodationCategories } from "@/hooks/useAccommodationCategories";
import { categoryToSlug, getCategoryIcon } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const location = useLocation();
  const [isAttractionsExpanded, setIsAttractionsExpanded] = useState(false);
  const [isAccommodationsExpanded, setIsAccommodationsExpanded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAccommodationAddForm, setShowAccommodationAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newAccommodationCategoryName, setNewAccommodationCategoryName] = useState("");
  const { categories, loading, createCategory, isCreating } = useAttractionCategories();
  const { 
    categories: accommodationCategories, 
    loading: accommodationLoading, 
    createCategory: createAccommodationCategory, 
    isCreating: isCreatingAccommodation 
  } = useAccommodationCategories();

  useEffect(() => {
    if (location.pathname.startsWith('/attractions/')) {
      setIsAttractionsExpanded(true);
    }
    if (location.pathname.startsWith('/accommodations/')) {
      setIsAccommodationsExpanded(true);
    }
  }, [location.pathname]);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      createCategory(
        { name: newCategoryName.trim() },
        {
          onSuccess: () => {
            setNewCategoryName("");
            setShowAddForm(false);
          }
        }
      );
    }
  };

  const handleCancelAdd = () => {
    setNewCategoryName("");
    setShowAddForm(false);
  };

  const handleAddAccommodationCategory = () => {
    if (newAccommodationCategoryName.trim()) {
      createAccommodationCategory(
        { name: newAccommodationCategoryName.trim() },
        {
          onSuccess: () => {
            setNewAccommodationCategoryName("");
            setShowAccommodationAddForm(false);
          }
        }
      );
    }
  };

  const handleCancelAccommodationAdd = () => {
    setNewAccommodationCategoryName("");
    setShowAccommodationAddForm(false);
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
        <nav className="flex flex-1 flex-col gap-1 px-2 py-3">
          <NavLink to={"/tax-declaration"} className={getLinkClassName}>
            <Home className="w-4 h-4" />
            <span>Overview</span>
          </NavLink>
          
          <div>
            <NavLink
              to={"/accommodations"}
              onClick={() => setIsAccommodationsExpanded(!isAccommodationsExpanded)}
              className={() => {
                const baseClasses = "w-full px-6 py-2 rounded-lg flex items-center gap-2 text-left";
                
                const isExactlyOnAccommodations = location.pathname === '/accommodations';
                
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
                    {accommodationCategories.map((category) => {
                      const IconComponent = getCategoryIcon(category.name);
                      const slug = categoryToSlug(category.name);
                      
                      return (
                        <NavLink 
                          key={category.id}
                          to={`/accommodations/${slug}`} 
                          className={({ isActive }) =>
                            `px-4 py-2 rounded-lg flex items-center gap-2 ${
                              isActive
                                ? "bg-primary text-white font-medium"
                                : "text-gray-600 font-normal hover:bg-primary hover:text-white hover:font-medium"
                            }`
                          }
                        >
                          <IconComponent className="w-4 h-4" />
                          <span>{category.name}</span>
                        </NavLink>
                      );
                    })}

                    {showAccommodationAddForm ? (
                      <div className="px-4 py-2 space-y-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-gray-600 font-medium">Name</label>
                          <Input
                            type="text"
                            value={newAccommodationCategoryName}
                            onChange={(e) => setNewAccommodationCategoryName(e.target.value)}
                            placeholder="Enter category name"
                            className="h-7 text-xs"
                            disabled={isCreatingAccommodation}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddAccommodationCategory();
                              } else if (e.key === 'Escape') {
                                handleCancelAccommodationAdd();
                              }
                            }}
                          />
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={handleAddAccommodationCategory}
                            disabled={isCreatingAccommodation || !newAccommodationCategoryName.trim()}
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
              to={"/attractions"}
              onClick={() => setIsAttractionsExpanded(!isAttractionsExpanded)}
              className={() => {
                const baseClasses = "w-full px-6 py-2 rounded-lg flex items-center gap-2 text-left";
                
                const isExactlyOnAttractions = location.pathname === '/attractions';
                
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
                    {categories.map((category) => {
                      const IconComponent = getCategoryIcon(category.name);
                      const slug = categoryToSlug(category.name);
                      
                      return (
                        <NavLink 
                          key={category.id}
                          to={`/attractions/${slug}`} 
                          className={({ isActive }) =>
                            `px-4 py-2 rounded-lg flex items-center gap-2 ${
                              isActive
                                ? "bg-primary text-white font-medium"
                                : "text-gray-600 font-normal hover:bg-primary hover:text-white hover:font-medium"
                            }`
                          }
                        >
                          <IconComponent className="w-4 h-4" />
                          <span>{category.name}</span>
                        </NavLink>
                      );
                    })}

                    {showAddForm ? (
                      <div className="px-4 py-2 space-y-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-gray-600 font-medium">Name</label>
                          <Input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Enter category name"
                            className="h-7 text-xs"
                            disabled={isCreating}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddCategory();
                              } else if (e.key === 'Escape') {
                                handleCancelAdd();
                              }
                            }}
                          />
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
          
          <NavLink to={"/experiences"} className={getLinkClassName}>
            <Camera className="w-4 h-4" />
            Experiences
          </NavLink>
          
          <NavLink to={"/tour-providers"} className={getLinkClassName}>
            <Car className="w-4 h-4" />
            Tour Providers
          </NavLink>
          
          <NavLink to={"/events"} className={getLinkClassName}>
            <Calendar className="w-4 h-4" />
            Events
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
