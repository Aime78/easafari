import logo from "@/assets/logo.png";

export const PageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col items-center space-y-6 animate-in fade-in duration-500">
        {/* Logo with pulse animation */}
        <div className="relative">
          {/* Glow effect behind logo */}
          <div className="absolute inset-0 bg-primary opacity-20 blur-2xl rounded-full animate-pulse"></div>

          {/* Logo */}
          <img
            src={logo}
            alt="EaSafari Logo"
            className="w-24 h-24 object-contain relative z-10 animate-pulse"
          />
        </div>

        {/* Progress Dots */}
        <div className="flex space-x-2">
          <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
