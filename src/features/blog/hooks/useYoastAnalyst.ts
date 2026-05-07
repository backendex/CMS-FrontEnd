import { useState, useEffect } from 'react';
import { SeoMetadata } from '@/features/blog/types/types';

export interface SeoCheck {
  id: string;
  label: string;
  description: string;
  status: 'good' | 'ok' | 'problem' | 'info';
}

export interface YoastScore {
  color: string;
  message: string;
  points: number;
  checks: SeoCheck[];
}

export const useYoastAnalysis = (content: string, title: string, seoData: SeoMetadata) => {
  const [score, setScore] = useState<YoastScore>({
    color: 'gray',
    message: 'Esperando contenido...',
    points: 0,
    checks: []
  });

  useEffect(() => {
    const { focusKeyword, seoTitle, metaDescription } = seoData;
    const checks: SeoCheck[] = [];

    // 1. Palabra clave
    if (!focusKeyword || focusKeyword.length < 3) {
      setScore({ 
        color: '#d3d3d3', 
        message: 'Escribe una palabra clave para analizar', 
        points: 0,
        checks: [{
          id: 'keyword-missing',
          label: 'Palabra clave objetivo',
          description: 'No se ha establecido ninguna palabra clave objetivo para esta entrada.',
          status: 'problem'
        }]
      });
      return;
    }

    let currentPoints = 0;
    const keywordLower = focusKeyword.toLowerCase();
    const contentLower = content.toLowerCase();
    const titleToAnalyze = (seoTitle || title).toLowerCase();

    // --- ANÁLISIS DE TÍTULO ---
    if (titleToAnalyze.includes(keywordLower)) {
      currentPoints += 30;
      checks.push({
        id: 'title-keyword',
        label: 'Palabra clave en el título',
        description: '¡Buen trabajo! La palabra clave aparece en el título SEO.',
        status: 'good'
      });
    } else {
      checks.push({
        id: 'title-keyword',
        label: 'Palabra clave en el título',
        description: 'La palabra clave objetivo no aparece en el título SEO.',
        status: 'problem'
      });
    }

    // --- ANÁLISIS DE META DESCRIPCIÓN ---
    if (metaDescription) {
      if (metaDescription.toLowerCase().includes(keywordLower)) {
        currentPoints += 30;
        checks.push({
          id: 'meta-keyword',
          label: 'Frase clave en la meta descripción',
          description: 'La frase clave o sus sinónimos aparecen en la meta descripción.',
          status: 'good'
        });
      } else {
        checks.push({
          id: 'meta-keyword',
          label: 'Frase clave en la meta descripción',
          description: 'Se ha especificado una meta descripción, pero no contiene la frase clave.',
          status: 'problem'
        });
      }

      if (metaDescription.length >= 120 && metaDescription.length <= 160) {
        currentPoints += 10;
        checks.push({
          id: 'meta-length',
          label: 'Longitud de la meta descripción',
          description: '¡Bien hecho! La meta descripción tiene una longitud óptima.',
          status: 'good'
        });
      } else {
        checks.push({
          id: 'meta-length',
          label: 'Longitud de la meta descripción',
          description: `La meta descripción es muy ${metaDescription.length < 120 ? 'corta' : 'larga'} (${metaDescription.length} caracteres). El máximo es 160.`,
          status: 'ok'
        });
      }
    } else {
      checks.push({
        id: 'meta-missing',
        label: 'Meta descripción',
        description: 'No se ha especificado ninguna meta descripción. Los buscadores mostrarán texto del contenido en su lugar.',
        status: 'problem'
      });
    }

    // --- ANÁLISIS DE CONTENIDO ---
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
    if (wordCount >= 300) {
      currentPoints += 10;
      checks.push({
        id: 'word-count',
        label: 'Longitud del texto',
        description: `El texto contiene ${wordCount} palabras. Esto es mayor o igual al mínimo recomendado de 300 palabras.`,
        status: 'good'
      });
    } else {
      checks.push({
        id: 'word-count',
        label: 'Longitud del texto',
        description: `El texto contiene ${wordCount} palabras. Es muy poco, intenta llegar al menos a 300.`,
        status: 'problem'
      });
    }

    if (contentLower.includes(keywordLower)) {
      currentPoints += 20;
      const count = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length;
      checks.push({
        id: 'content-keyword',
        label: 'Densidad de la frase clave',
        description: `Se ha encontrado la frase clave ${count} veces. ¡Excelente!`,
        status: 'good'
      });
    } else {
      checks.push({
        id: 'content-keyword',
        label: 'Densidad de la frase clave',
        description: 'La frase clave objetivo no se encontró en el contenido.',
        status: 'problem'
      });
    }

    // 5. Determinar color final (Semáforo)
    let color = '#ff4d4d';
    let message = 'SEO Pobre';

    if (currentPoints >= 70) {
      color = '#4caf50';
      message = '¡SEO Excelente!';
    } else if (currentPoints >= 40) {
      color = '#ffa500';
      message = 'SEO Aceptable';
    }

    setScore({ color, message, points: currentPoints, checks });

  }, [content, title, seoData]);

  return score;
};