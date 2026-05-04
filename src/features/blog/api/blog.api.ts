/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/api";
import { BlogPost } from "@/features/blog/types/types";

const BASE_URL = "https://localhost:44351/api/Content";

export const getBlogs = async (siteId: string, tableName: string): Promise<BlogPost[]> => {
  try {
    const res = await api.get(`${BASE_URL}/getPosts`, {
      params: { siteId, TableName: tableName } // En GET el back pide TableName
    }); 
    console.log("Datos crudos recibidos:", res.data)
    return res.data;
  } catch (error: any) {
    handleBlogApiError(error);
    throw error;
  }
};

export const getByIdBlogs = async (tableName: string, id: number, siteId: string): Promise<BlogPost[]> => {
try {
  const res = await api.get(`${BASE_URL}/getByIdPost`, {
    params: {tableName, id, siteId}
  });
  console.log("Datos crudos recibidos:", res.data)
  return res.data;
} catch (error: any) {
  handleBlogApiError(error);
  throw error;
}
};

export const createPost = async (postData: BlogPost, tableName: string): Promise<{ id: number; message: string }> => {
  try {
    // Enviamos el postData en el body y el siteName en los params (Query String)
    const res = await api.post(`${BASE_URL}/createPost`, postData, {
      params: { siteName: tableName }
    });
    return res.data;
  } catch (error: any) {
    handleBlogApiError(error);
    throw error;
  }
};

export const getPostById = async (id: string, siteId: string): Promise<BlogPost> => {
  try {
    const res = await api.get(`${BASE_URL}/getPostById`, {
      params: { id, siteId }
    });
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    handleBlogApiError(error);
    throw error;
  }
};

export const updatePost = async (id: string, data: BlogPost) => {
  const response = await api.put(`${BASE_URL}/updatePost`, data);
  return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleBlogApiError = (error: any) => {
  if (error.response) {
    console.error("Server Error:", error.response.data);
  } else if (error.request) {
    console.error("Network Error: No se pudo conectar con el servidor .NET");
  } else {
    console.error("Error:", error.message);
  }
};

