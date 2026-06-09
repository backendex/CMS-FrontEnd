import { MeResponse, SiteType } from "@/features/sites/types/siteType"
import api from "@/lib/api"

const BASE_URL = "/site";

export const getMe = async (): Promise<MeResponse> => {
  const { data } = await api.get(
    `${BASE_URL}/user-access`
  );
  return data;
};

export const createSite = async (siteData: Omit<SiteType, "id" | "tableName">): Promise<SiteType> => {
  const { data } = await api.post(BASE_URL, siteData);
  return data;
};

export const updateSite = async (id: string, siteData: Partial<SiteType>): Promise<SiteType> => {
  const { data } = await api.put(`${BASE_URL}/${id}`, siteData);
  return data;
};

export const deleteSite = async (id: string): Promise<{ message: string }> => {
  const { data } = await api.delete(`${BASE_URL}/${id}`);
  return data;
};

