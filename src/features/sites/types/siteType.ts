export type SiteStatus = "active" | "maintenance";

export interface SiteType {
  id: number;
  name: string;
  url: string;
  toursCount: number;
  status: SiteStatus;
  color: string; 
}
