export interface SeoMetadata {
  seoTitle: string;
  metaDescription: string;
  focusKeyword: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
}
export interface BlogPost {
  id: number; 
  title: string;           // Corresponde a post_title
  slug: string;            // Corresponde a post_name
  content: string;         // Corresponde a post_content
  postDate?: Date | string; // Corresponde a post_date
  imageUrl: string;        // URL completa para la vista
  featuredImage?: string;  // ID o path de la imagen destacada
  siteId: string;          // Tu GUID: '7674eb51-27c0-4c59-b4e6-1c451a26939f'
  isPublished: boolean;    // Corresponde a post_status ('publish' vs 'draft')
  seoData: SeoMetadata;    // Objeto anidado para metadatos
}
export interface PreviewProps {
  title: string;
  slug: string;
  description: string;
  siteDomain: string; 
}
export interface BlogFormProps {
  initialData?: BlogPost;
  onSubmit: (data: BlogPost) => void;
  isSubmitting?: boolean;
}
export interface BlogsTableProps {
  blogs: BlogPost[];
  onDelete?: (id: number) => void;
}
