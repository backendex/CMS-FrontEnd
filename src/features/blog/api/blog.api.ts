import api from "@/lib/api";
import { BlogPost } from "@/features/blog/types/types";

// Usamos el puerto que ya tienes configurado en tu servicio de Auth
const BASE_URL = "https://localhost:44351/api/Content";

export const createPost = async (postData: BlogPost): Promise<{ id: number; message: string }> => {
  try {
    // Usamos el endpoint que confirmaste
    const res = await api.post(`${BASE_URL}/createPost`, postData);
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    handleBlogApiError(error);
    throw error;
  }
};

export const getBlogs = async (siteId: string): Promise<BlogPost[]> => {
  try {
    const res = await api.get(`${BASE_URL}/getPosts`); 
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // Error de .NET (400, 500, etc.)
    console.error("Server Error:", error.response.data);
  } else if (error.request) {
    // Error de red / CORS
    console.error("Network Error: No se pudo conectar con el servidor .NET");
  } else {
    console.error("Error:", error.message);
  }
};

