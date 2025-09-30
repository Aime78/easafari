import {
  Home,
  Bed,
  MapPin,
  Settings,
  Plus,
  Store,
  User,
  Mountain,
  Calendar,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useProviderProfile } from "@/features/provider/profile/hooks/useProvider";

const ProviderSidebar = () => {
  const { data: providerProfile } = useProviderProfile();

  const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `px-6 py-2 rounded-lg flex items-center gap-2 ${
      isActive
        ? "bg-primary text-white font-medium"
        : "text-black font-normal hover:bg-primary hover:text-white hover:font-medium"
    }`;

  // Service configuration with icons and routes
  const serviceConfig = {
    ACCOMMODATION: {
      icon: Bed,
      label: "Accommodations",
      route: "/provider/accommodations",
    },
    EXPERIENCE: {
      icon: Mountain,
      label: "Experiences",
      route: "/provider/experiences",
    },
    ATTRACTION: {
      icon: MapPin,
      label: "Attractions",
      route: "/provider/attractions",
    },
    EVENT: {
      icon: Calendar,
      label: "Events",
      route: "/provider/events",
    },
  };

  // Get enabled services from provider profile services array
  const enabledServices = providerProfile?.services
    ? providerProfile.services
        .filter((service) => service.active === 1) // Only active services
        .map((service) => service.code as keyof typeof serviceConfig)
        .filter((serviceCode) => serviceConfig[serviceCode]) // Only include services that exist in config
    : [];

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
          <NavLink to={"/provider/dashboard"} className={getLinkClassName}>
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </NavLink>

          {/* Dynamically render enabled services */}
          {enabledServices.map((serviceName) => {
            const service = serviceConfig[serviceName];
            if (!service) return null; // Safety check

            const IconComponent = service.icon;

            return (
              <NavLink
                key={serviceName}
                to={service.route}
                className={getLinkClassName}
              >
                <IconComponent className="w-4 h-4" />
                <span>{service.label}</span>
              </NavLink>
            );
          })}

          <NavLink to={"/provider/market"} className={getLinkClassName}>
            <Store className="w-4 h-4" />
            <span>Market</span>
          </NavLink>

          <NavLink to={"/provider/bookings"} className={getLinkClassName}>
            <Plus className="w-4 h-4" />
            <span>Bookings</span>
          </NavLink>

          <NavLink to={"/provider/payments"} className={getLinkClassName}>
            <Bed className="w-4 h-4" />
            <span>Payments</span>
          </NavLink>

          <NavLink to={"/provider/profile"} className={getLinkClassName}>
            <User className="w-4 h-4" />
            <span>Profile</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default ProviderSidebar;
