import axios from 'axios';

export interface Tour {
  id?: string;
  siteid: string;      
  name: string;
  description: string;
  price: number;
  category: string;
  isactive: boolean;   
  seotitle: string;    
  seodescription: string; 
  slug: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:44351/api';

export const tourService = {
  getBySite: async (siteId: string): Promise<Tour[]> => {
    const response = await axios.get(`${API_URL}/tour/site/${siteId}`); 
    return response.data;
  },

  create: async (tour: Tour): Promise<Tour> => {
    const response = await axios.post(`${API_URL}/tour`, tour);
    return response.data;
  },
};