/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBlogs } from '@/features/blog/api/blog.api';
import { BlogPost, BlogsTableProps } from '@/features/blog/types/types';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { BlogsTable } from '@/features/blog/components/blogTable';

interface ExtendedProps extends BlogsTableProps {
  blogs: Blogs[];
}
export function BlogPage() {
  const { siteId, id } = useParams<{ siteId: string, id: string }>(); 
  const [loading, setLoading] = useState(true);
  const [Blogs, setBlogs] = useState<BlogPost[]>([]);

  const loadBlogs = useCallback(async () => {
        if (!siteId || siteId === "undefined") return;
        try {
          setLoading(true);
          console.log(`Iniciando petición para el sitio: ${siteId}`);         
          const response = await getBlogs(siteId);
          setBlogs(response);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error("Error en la carga:", error);
        } finally {
          setLoading(false);
        }
      }, [siteId]);
    
      useEffect(() => {
        loadBlogs();
      }, [loadBlogs]);
    
      if (!siteId) return <p>Cargando contexto del sitio...</p>;

    return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground">
            Gestiona la información del blog.
          </p>
        </div>
        <Button asChild>
          <Link to={`/dash/${siteId}/blog/new`} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo blog
          </Link>
        </Button>
      </div>
      <div className="rounded-md border bg-white p-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (                   
           <BlogsTable blogs ={Blogs} siteId ={siteId} />
        )}
      </div>
    </div>
  );       
}