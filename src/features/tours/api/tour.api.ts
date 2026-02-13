import api from "@/lib/api";
import { Tour } from "@/features/tours/types/tourType";

//const BASE_URL = "https://localhost:44351/api/tour";

export const getTour = async (siteId: string): Promise<Tour[]> => {
  try {
    if (!siteId || siteId === "") {
      console.warn("getTour fue llamado sin un siteId válido.");
      return [];
    }
    const res = await api.get(`https://localhost:44351/api/tour/getTour${siteId}`);
    
    console.log("Datos crudos desde .NET:", res.data);
    
    if (!Array.isArray(res.data)) {
      console.error("La API no devolvió un array. Se recibió:", res.data);
      return [];
    }
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error en la petición GET tours:", error);
    throw error;
  }
};

export const getTourById = async (siteId: string): Promise<Tour> => {
  try {
    const res = await api.get(`https://localhost:44351/api/tour/getTourById`);
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`Error al obtener el tour con ID ${siteId}:`, error);
    throw error;
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createTour = async (tourData: any) => {
  try {
    const res = await api.post(`https://localhost:44351/api/tour/createTour`, tourData);
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      console.error("Error al crear tour:", error.response.data);
    }
    throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateTour = async (id: string, tourData: any) => {
  try {
    const res = await api.put(`https://localhost:44351/api/tour/${id}`, tourData);
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al actualizar tour:", error);
    throw error;
  }
};

export const deleteTour = async (id: string) => {
  try {
    const res = await api.delete(`https://localhost:44351/api/tour/${id}`);
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al eliminar tour:", error);
    throw error;
  }
};


