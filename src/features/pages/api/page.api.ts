import api from "@/lib/api";

export interface PageTranslationDto {
  language: string;
  title: string;
  blocksJson: string;
}

export interface PageSaveDto {
  slug: string;
  isPublished: boolean;
  translations: PageTranslationDto[];
}

export interface PageDto {
  id: string;
  siteId: string;
  slug: string;
  isPublished: boolean;
  translations: PageTranslationDto[];
}

const BASE_URL = "/page";

export const getPagesBySite = async (siteId: string): Promise<PageDto[]> => {
  const { data } = await api.get(BASE_URL, {
    params: { siteId },
  });
  return data;
};

export const getPageById = async (id: string): Promise<PageDto> => {
  const { data } = await api.get(`${BASE_URL}/${id}`);
  return data;
};

export const createPage = async (
  siteId: string,
  slug: string,
  title: string
): Promise<PageDto> => {
  const { data } = await api.post(
    BASE_URL,
    { slug, title },
    { params: { siteId } }
  );
  return data;
};

export const updatePage = async (
  id: string,
  pageData: PageSaveDto
): Promise<PageDto> => {
  const { data } = await api.put(`${BASE_URL}/${id}`, pageData);
  return data;
};

export const deletePage = async (id: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`);
};
