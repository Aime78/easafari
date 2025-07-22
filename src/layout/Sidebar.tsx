import {
  Home,
  Bed,
  MapPin,
  Camera,
  Car,
  Calendar,
  ChevronDown,
  ChevronRight,
  TreePine,
  Landmark,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";

const Sidebar = () => {
  const location = useLocation();
  const [isAttractionsExpanded, setIsAttractionsExpanded] = useState(false);

  // Auto-expand attractions when on a subcategory page
  useEffect(() => {
    if (location.pathname.startsWith('/attractions/')) {
      setIsAttractionsExpanded(true);
    }
  }, [location.pathname]);

  const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `px-6 py-2 rounded-lg flex items-center gap-2 ${
      isActive
        ? "bg-primary text-white font-medium"
        : "text-black font-normal hover:bg-primary hover:text-white hover:font-medium"
    }`;

  return (
    <div className="bg-[#f6f8fc] flex flex-col">
      {/* Logo Section */}
      <div className="flex h-12 items-center gap-3 px-4 lg:h-[60px] lg:px-6 font-bold">
        <img
          src={logo}
          alt="Company Logo"
          className="w-20 h-20 object-contain"
        />
      </div>

      {/* Navigation Section */}
      <div className="flex flex-col h-[calc(100vh-70px)] text-sm">
        <nav className="flex flex-1 flex-col gap-1 px-2 py-3">
          <NavLink to={"/tax-declaration"} className={getLinkClassName}>
            <Home className="w-4 h-4" />
            <span>Overview</span>
          </NavLink>
          
          <NavLink to={"/business-registration"} className={getLinkClassName}>
            <Bed className="w-4 h-4" />
            Accommodation
          </NavLink>

          <div>
            <button
              onClick={() => setIsAttractionsExpanded(!isAttractionsExpanded)}
              className={`w-full px-6 py-2 rounded-lg flex items-center gap-2 text-left ${
                isAttractionsExpanded
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-black font-normal hover:bg-primary hover:text-white hover:font-medium"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="flex-1">Attractions</span>
              {isAttractionsExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {isAttractionsExpanded && (
              <div className="ml-6 mt-1 space-y-1">
                <NavLink 
                  to={"/attractions/national-parks"} 
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg flex items-center gap-2 ${
                      isActive
                        ? "bg-primary text-white font-medium"
                        : "text-gray-600 font-normal hover:bg-primary hover:text-white hover:font-medium"
                    }`
                  }
                >
                  <TreePine className="w-4 h-4" />
                  <span>National Parks</span>
                </NavLink>
                <NavLink 
                  to={"/attractions/cultural-heritage"} 
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg flex items-center gap-2 ${
                      isActive
                        ? "bg-primary text-white font-medium"
                        : "text-gray-600 font-normal hover:bg-primary hover:text-white hover:font-medium"
                    }`
                  }
                >
                  <Landmark className="w-4 h-4" />
                  <span>Cultural Sites</span>
                </NavLink>
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
