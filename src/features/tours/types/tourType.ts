import { ReactNode } from "react";

export interface Tour {
  status: string;
  capacity: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isActive: any;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dynamic_data: any;
}