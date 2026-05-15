import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTour } from '../api/tour.api';
import { Tour } from '../types/tourType';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { ToursTable } from './tourTable';

export const TourList = () => {
  const { siteId } = useParams<{ siteId: string }>(); 
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState<Tour[]>([]);
  
  const loadTours = useCallback(async () => {
    if (!siteId || siteId === "undefined") return;
    try {
      setLoading(true);
      const response = await getTour(siteId);
      setTours(response);
    } catch (error: any) {
      console.error("Error cargando tours:", error);
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    loadTours();
  }, [loadTours]);

  if (!siteId) return <p>Cargando contexto del sitio...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tours</h1>
          <p className="text-muted-foreground">
            Gestiona la información de las actividades.
          </p>
        </div>
        <Button asChild>
          <Link to={`/dash/${siteId}/tour/new`} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Tour
          </Link>
        </Button>
      </div>
      <div className="rounded-md border bg-white p-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (                   
           <ToursTable tours={tours} siteId={siteId} />
        )}
      </div>
    </div>
  );
}
