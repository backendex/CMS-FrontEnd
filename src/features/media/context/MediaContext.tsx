import React, { createContext, useContext, useState, useEffect } from "react";

interface MediaItem {
  id: string | number;
  url: string;
  name: string;
  size: string;
  format: string;
}

interface MediaContextType {
  mediaItems: MediaItem[];
  addMedia: (item: MediaItem) => void;
  removeMedia: (id: string | number) => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    // Intentar cargar desde localStorage al iniciar
    const saved = localStorage.getItem("cms_media_library");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    // Mock data inicial si no hay nada guardado
    return [
      { id: 1, url: "https://picsum.photos/seed/51/400/400", name: "hero-banner-v2.jpg", size: "1.2 MB", format: "JPG" },
      { id: 2, url: "https://picsum.photos/seed/52/400/400", name: "footer-logo.png", size: "0.5 MB", format: "PNG" },
    ];
  });

  // Persistir en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("cms_media_library", JSON.stringify(mediaItems));
  }, [mediaItems]);

  const addMedia = (item: MediaItem) => {
    setMediaItems((prev) => [item, ...prev]);
  };

  const removeMedia = (id: string | number) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <MediaContext.Provider value={{ mediaItems, addMedia, removeMedia }}>
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error("useMedia must be used within a MediaProvider");
  }
  return context;
};
