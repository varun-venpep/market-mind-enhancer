
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { ReactNode } from "react";

const PUBLISHABLE_KEY = "pk_test_ZGV2b3RlZC1odXNreS01MS5jbGVyay5hY2NvdW50cy5kZXYk";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

export function ClerkProviderWithTheme({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  return (
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: isDarkMode ? dark : undefined,
        elements: {
          formButtonPrimary: 
            "bg-primary hover:bg-primary/90 text-primary-foreground",
          card: "bg-background border border-border shadow-sm",
          formInput: "bg-background border border-input",
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
}
