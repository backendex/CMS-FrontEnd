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
  // Identificadores
  id: number; // long en C# es number en TS
  siteId: string; // Guid en C# es string en TS
  // Auditoría y Fechas (Strings según tu modelo de C#)
  postAuthor: number;
  postDate: string;
  postDateGmt: string;
  postModified: string;
  postModifiedGmt: string;
  postTitle: string;    // Este es el que debes usar en la columna "Título"
  postContent: string;
  postExcerpt: string;
  postName: string;     // Este es el "slug"
  postStatus: string;   // 'publish', 'draft', etc.
  commentStatus: string;
  pingStatus: string;
  postType: string;     // 'post'
  postPassword?: string;
  toPing?: string;
  pinged?: string;
  postContentFiltered?: string;
  postParent: number;
  guid: string;         // URL interna de WP
  menuOrder: number;
  postMimeType?: string;
  commentCount: number;
  seoData: SeoMetadata; 
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
