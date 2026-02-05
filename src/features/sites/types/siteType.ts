export type SiteStatus = "active" | "maintenance";

export interface SiteType {
  id: string;
  name: string;
  domain: string;
  color: string;
  isActive: boolean;
  isMaintenance: boolean;
}
