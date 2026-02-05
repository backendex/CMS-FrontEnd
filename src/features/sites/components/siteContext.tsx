import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { SiteType } from "@/features/sites/types/siteType";

interface SiteContextType {
  activeSite: SiteType | null;
  setActiveSite: (site: SiteType) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

// Hook seguro
// eslint-disable-next-line react-refresh/only-export-components
export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error("useSite must be used inside SiteProvider");
  }
  return context;
};

export const SiteProvider = ({ children }: { children: ReactNode }) => {
  const [activeSite, setActiveSiteState] = useState<SiteType | null>(null);

  // 🔄 Persistencia
  useEffect(() => {
    const stored = localStorage.getItem("activeSite");
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveSiteState(JSON.parse(stored));
    }
  }, []);

  const setActiveSite = (site: SiteType) => {
    setActiveSiteState(site);
    localStorage.setItem("activeSite", JSON.stringify(site));
  };

  return (
    <SiteContext.Provider value={{ activeSite, setActiveSite }}>
      {children}
    </SiteContext.Provider>
  );
};
