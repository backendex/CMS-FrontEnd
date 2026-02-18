import { useState, useEffect } from 'react';
import { SeoMetadata } from '@/features/blog/types/types';

export const useYoastAnalysis = (content: string, title: string, seoData: SeoMetadata) => {
  const [score, setScore] = useState({
    color: 'gray',
    message: 'Esperando contenido...',
    points: 0
  });

  useEffect(() => {
    const { focusKeyword, seoTitle, metaDescription } = seoData;

    // 1. Validación base: Falta palabra clave
    if (!focusKeyword || focusKeyword.length < 3) {
      setScore({ color: '#d3d3d3', message: 'Escribe una palabra clave para analizar', points: 0 });
      return;
    }

    let currentPoints = 0;
    const keywordLower = focusKeyword.toLowerCase();

    // 2. Análisis de Título SEO
    const titleToAnalyze = seoTitle || title;
    if (titleToAnalyze.toLowerCase().includes(keywordLower)) currentPoints += 30;
    
    // 3. Análisis de Meta Descripción
    if (metaDescription.toLowerCase().includes(keywordLower)) currentPoints += 30;
    if (metaDescription.length >= 120 && metaDescription.length <= 160) currentPoints += 10;

    // 4. Análisis de Contenido (Cuerpo del blog)
    const wordCount = content.split(/\s+/).length;
    if (wordCount > 300) currentPoints += 10;
    if (content.toLowerCase().includes(keywordLower)) currentPoints += 20;

    // 5. Determinar color final (Semáforo)
    if (currentPoints < 40) {
      setScore({ color: '#ff4d4d', message: 'SEO Pobre', points: currentPoints }); // Rojo
    } else if (currentPoints < 70) {
      setScore({ color: '#ffa500', message: 'SEO Aceptable', points: currentPoints }); // Naranja
    } else {
      setScore({ color: '#4caf50', message: '¡SEO Excelente!', points: currentPoints }); // Verde
    }

  }, [content, title, seoData]);

  return score;
};