import api from "@/lib/api";
import { MediaItem, SaveMediaDto, ImageKitAuthDto } from "../types/media.types";

const BASE_URL = "/media";

export const getImageKitAuth = async (): Promise<ImageKitAuthDto> => {
  const res = await api.get(`${BASE_URL}/auth/imagekit`);
  return res.data;
};

export const saveMedia = async (dto: SaveMediaDto): Promise<MediaItem> => {
  const res = await api.post(`${BASE_URL}/save`, dto);
  return res.data;
};

export const getMediaBySite = async (siteId: string): Promise<MediaItem[]> => {
  const res = await api.get(BASE_URL, { params: { siteId } });
  return res.data;
};

export const deleteMedia = async (id: number): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`);
};
