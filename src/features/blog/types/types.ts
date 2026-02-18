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
  title: string;
  slug: string;
  content: string;
  featuredImage?: string;
  siteId: string; 
  isPublished: boolean;
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
