import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { MediaItem } from "../types/media.types";
import { getMediaBySite, deleteMedia } from "../api/media.api";
import { useSite } from "@/features/sites";

interface MediaContextType {
  mediaItems: MediaItem[];
  isLoading: boolean;
  error: string | null;
  addMedia: (item: MediaItem) => void;
  removeMedia: (id: number) => Promise<void>;
  refreshMedia: () => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeSite } = useSite();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    if (!activeSite?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const items = await getMediaBySite(activeSite.id);
      setMediaItems(items);
    } catch (err) {
      console.error("Error al cargar medios:", err);
      setError("No se pudieron cargar los archivos de medios.");
    } finally {
      setIsLoading(false);
    }
  }, [activeSite?.id]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const addMedia = (item: MediaItem) => {
    setMediaItems((prev) => [item, ...prev]);
  };

  const removeMedia = async (id: number) => {
    await deleteMedia(id);
    setMediaItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <MediaContext.Provider
      value={{ mediaItems, isLoading, error, addMedia, removeMedia, refreshMedia: fetchMedia }}
    >
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
