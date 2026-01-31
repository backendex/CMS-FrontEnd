import axios from 'axios';

// Definimos la interfaz para que TypeScript te ayude con el autocompletado
export interface Tour {
  id?: string;
  siteId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
  slug: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:44351/api';

export const tourService = {
  // Obtener todos los tours de un sitio específico
  getBySite: async (siteId: string): Promise<Tour[]> => {
    const response = await axios.get(`${API_URL}/tours/site/${siteId}`);
    return response.data;
  },

  // Crear un nuevo tour
  create: async (tour: Tour): Promise<Tour> => {
    const response = await axios.post(`${API_URL}/tours`, tour);
    return response.data;
  },

  // Actualizar un tour existente
  update: async (id: string, tour: Tour): Promise<void> => {
    await axios.put(`${API_URL}/tours/${id}`, tour);
  },

  // Eliminar un tour
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/tours/${id}`);
  }
};