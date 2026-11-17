import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  size?: "sm" | "md";
}

export function LanguageSwitcher({ className, size = "sm" }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-border/80 bg-muted/40 p-0.5 text-xs font-semibold shadow-2xs select-none transition-all",
        size === "sm" ? "h-8" : "h-9",
        className,
      )}
      role="group"
      aria-label="Language selection toggle"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={cn(
          "rounded-md px-2.5 py-1 transition-all cursor-pointer font-medium tracking-tight",
          language === "en"
            ? "bg-card text-foreground shadow-2xs font-bold"
            : "text-muted-foreground hover:text-foreground",
        )}
        aria-pressed={language === "en"}
      >
        EN
      </button>

      <span className="text-border px-0.5 text-[11px] font-normal" aria-hidden="true">
        |
      </span>

      <button
        type="button"
        onClick={() => setLanguage("hi")}
        className={cn(
          "rounded-md px-2.5 py-1 transition-all cursor-pointer font-medium tracking-tight",
          language === "hi"
            ? "bg-primary text-primary-foreground shadow-2xs font-bold"
            : "text-muted-foreground hover:text-foreground",
        )}
        aria-pressed={language === "hi"}
      >
        हिन्दी
      </button>
    </div>
  );
}
