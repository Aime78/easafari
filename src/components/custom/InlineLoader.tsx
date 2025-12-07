import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InlineLoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

const textSizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export const InlineLoader = ({
  size = "md",
  text,
  className,
}: InlineLoaderProps) => {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && (
        <span className={cn("text-gray-600 font-medium", textSizeClasses[size])}>
          {text}
        </span>
      )}
    </div>
  );
};

export default InlineLoader;
