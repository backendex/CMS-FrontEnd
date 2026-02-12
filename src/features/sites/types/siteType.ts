import { ReactNode } from "react";

export type SiteStatus = "active" | "maintenance";

export interface SiteType {
  [x: string]: ReactNode;
  id: string;
  name: string;
  domain: string;
  color: string;
  isActive: boolean;
  isMaintenance: boolean;
  
}
