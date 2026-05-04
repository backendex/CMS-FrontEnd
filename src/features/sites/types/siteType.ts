import { ReactNode } from "react";
export type SiteStatus = "active" | "maintenance";

export interface SiteType {
  [x: string]: any;
  id: string;
  name: string;
  domain: string;
  tableName: string; // Nuevo campo para el nombre de la tabla en DB
  color: string;
  isActive: boolean;
  isMaintenance: boolean;
}
export interface SiteContextType {
  activeSite: SiteType | null;
  setActiveSite: (site: SiteType) => void;
}
export interface Props {
  site: SiteType;
  onManage: () => void;
}
export interface MeResponse {
  userId: number;
  fullName: string;
  allowedSites: SiteType[];
}