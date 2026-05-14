/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/api";
import { Tour } from "@/features/tours/types/tourType";

const BASE_URL = "/tour";

export const getTour = async (siteId: string): Promise<Tour[]> => {
  try {
    const res = await api.get(`${BASE_URL}/getTour`, {
      params: { siteId },
    });
    console.log("Datos crudos recicidos:", res.data)
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error en la peticion GET tours:", error);
    throw error;
  }
};
export const getTourById = async (id: string, siteId: string): Promise<Tour> => {
  try {
    const res = await api.get(`${BASE_URL}/getTourById`, {
      params: { id, siteId } 
    });
    return res.data;
  } catch (error: any) {
    console.error(`Error al obtener el tour con ID ${id}:`, error);
    throw error;
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createTour = async (tourData: any) => {
  try {
    const res = await api.post(
      `${BASE_URL}/createTour`,
      tourData,
    );
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
export const updateTour = async (id: string, tourData: Partial<Tour>) => {
  try {
    const res = await api.put(`${BASE_URL}/${id}`, tourData);
    return res.data;
  } catch (error: any) {
    console.error("Error al actualizar tour:", error);
    throw error;
  }
};
export const deleteTour = async (id: string) => {
  try {
    const res = await api.delete(`${BASE_URL}/${id}`);
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al eliminar tour:", error);
    throw error;
  }
};
//Se añade funcion para contentType, nuevo ncambio para traer la informsción 
export const getContentTypes = async (siteId: string) => {
  const res = await api.get(`${BASE_URL}/content-type`, {
    params: { siteId }
  });
  return res.data;
};