/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/api";
import { BlogPost } from "@/features/blog/types/types";

const BASE_URL = "/Content";

export const getBlogs = async (siteId: string, tableName: string): Promise<BlogPost[]> => {
  try {
    const res = await api.get(`${BASE_URL}/getPosts`, {
      params: { siteId, TableName: tableName, siteName: tableName } 
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
    // Enviamos el postData en el body y el TableName en los params (Query String)
    // El backend usa TableName (PascalCase) igual que en getPosts
    const res = await api.post(`${BASE_URL}/createPost`, postData, {
      params: { TableName: tableName, siteName: tableName } // Enviamos ambos por compatibilidad
    });
    return res.data;
  } catch (error: any) {
    handleBlogApiError(error);
    throw error;
  }
};

export const getPostById = async (id: string, siteId: string, tableName: string): Promise<BlogPost> => {
  try {
    const res = await api.get(`${BASE_URL}/getByIdPost`, {
      params: { id, siteId, TableName: tableName, siteName: tableName }
    });
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    handleBlogApiError(error);
    throw error;
  }
};

export const updatePost = async (id: string, data: BlogPost): Promise<{ message: string }> => {
  try {
    // El backend espera: PUT /updatePost?TableName=...&id=...
    const response = await api.put(`${BASE_URL}/updatePost`, data, {
      params: { 
        TableName: data.tableName, 
        id: id 
      }
    });
    return response.data;
  } catch (error: any) {
    handleBlogApiError(error);
    throw error;
  }
};

export const deletePost = async (id: number, tableName: string, siteId: string): Promise<void> => {
  try {
    // El backend espera: DELETE /deletePost?TableName=...&id=...
    await api.delete(`${BASE_URL}/deletePost`, {
      params: { 
        id, 
        TableName: tableName, 
        siteName: tableName,
        siteId // Aunque el backend no lo pida explícitamente en el código mostrado, se mantiene por contexto si el controlador lo requiere.
      }
    });
  } catch (error: any) {
    handleBlogApiError(error);
    throw error;
  }
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

