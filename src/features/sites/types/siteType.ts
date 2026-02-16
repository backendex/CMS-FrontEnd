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