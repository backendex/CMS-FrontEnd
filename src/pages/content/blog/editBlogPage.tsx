import { useNavigate, useParams } from 'react-router-dom';
import { BlogForm } from '@/features/blog/components/blogForm';
import { useState } from 'react';

export function EditBlogPage() {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdate = async (data: any) => {
    if(!siteId) return;
    setLoading(true);
    try {
        navigate(`/dash/${siteId}/blog/edit`)
    } catch (error) {
        console.error("Error al crear:", error)
    }finally{
        setLoading(false);
    }
  };

  return (
      <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">Editar Tour</h1>
          <BlogForm onSubmit={handleUpdate} isLoading={loading} />
      </div>
    );
};