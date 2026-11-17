import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  ring?: boolean;
}

const sizeClasses = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-sm",
  xl: "h-16 w-16 text-lg font-semibold",
  "2xl": "h-24 w-24 text-2xl font-bold",
};

export function UserAvatar({
  src,
  name,
  size = "md",
  className,
  ring = false,
}: UserAvatarProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error state if src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const initials = name
    ? name
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "CT";

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  if (src && !hasError) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full bg-muted border border-border/80 shadow-2xs transition-transform",
          sizeClass,
          ring && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background",
          className,
        )}
      >
        <img
          src={src}
          alt={name ? `${name}'s profile photo` : "User profile photo"}
          onError={() => setHasError(true)}
          className="h-full w-full object-cover rounded-full"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative shrink-0 flex items-center justify-center rounded-full bg-primary/10 font-display text-primary border border-primary/20 shadow-2xs select-none",
        sizeClass,
        ring && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background",
        className,
      )}
      aria-label={name || "User avatar"}
    >
      {initials ? (
        <span>{initials}</span>
      ) : (
        <User className="h-1/2 w-1/2 text-primary" />
      )}
    </div>
  );
}
