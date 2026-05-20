export interface MediaItem {
  id: number;
  url: string;
  fileId: string;
  fileName: string;
  fileType: string;
  siteId: string;
  createdAt: string;
}

export interface SaveMediaDto {
  url: string;
  fileId: string;
  fileName: string;
  fileType: string;
  siteId: string;
}

export interface ImageKitAuthDto {
  token: string;
  expire: string;
  signature: string;
}
