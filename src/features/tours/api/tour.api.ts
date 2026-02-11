import api from "@/lib/api";
import { Tour } from "@/features/tours/types/tourType";

const BASE_URL = "https://localhost:44351/api/tour";

/**
 * Obtiene todos los tours vinculados a un sitio específico.
 */
export const getToursBySite = async (siteId: string): Promise<Tour[]> => {
  try {
    const res = await api.get(`${BASE_URL}/${siteId}/getTours`);
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      console.error("Error de servidor al obtener tours:", error.response.data);
    } else if (error.request) {
      console.error("Error de red: No se pudo contactar con el servidor de tours.");
    }
    throw error;
  }
};

/**
 * Crea un nuevo tour bajo la estructura multisitio.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createTour = async (siteId: string, tourData: any) => {
  try {
    const res = await api.post(`${BASE_URL}/createTour`, tourData);
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      console.error("Error al crear tour:", error.response.data);
    }
    throw error;
  }
};

/**
 * Obtiene el detalle de un tour por su ID único.
 */
export const getTourById = async (id: string): Promise<Tour> => {
  try {
    const res = await api.get(`${BASE_URL}/${id}`);
    return res.data;
  } catch (error: any) {
    console.error(`Error al obtener el tour con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Actualiza la información de un tour existente.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateTour = async (id: string, tourData: any) => {
  try {
    const res = await api.put(`${BASE_URL}/${id}`, tourData);
    return res.data;
  } catch (error: any) {
    console.error("Error al actualizar tour:", error);
    throw error;
  }
};

/**
 * Elimina un tour de la base de datos.
 */
export const deleteTour = async (id: string) => {
  try {
    const res = await api.delete(`${BASE_URL}/${id}`);
    return res.data;
  } catch (error: any) {
    console.error("Error al eliminar tour:", error);
    throw error;
  }
};