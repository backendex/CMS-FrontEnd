import React from 'react';
import {PreviewProps} from '@/features/blog/types/types'
const GooglePreview: React.FC<PreviewProps> = ({ title, slug, description, siteDomain }) => {
  // Valores por defecto para que no se vea vacío
  const displayTitle = title || "Título de tu post - Nombre del Sitio";
  const displayUrl = `https://${siteDomain}/${slug || 'tu-url-amigable'}`;
  const displayDesc = description || "Escribe una meta descripción para ver cómo aparecerá este artículo en los resultados de búsqueda de Google...";

  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #dfe1e5',
      fontFamily: 'arial, sans-serif',
      maxWidth: '600px',
      marginTop: '15px'
    }}>
      {/* URL / Breadcrumb */}
      <div style={{ fontSize: '14px', color: '#202124', marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
        <span style={{ backgroundColor: '#f1f3f4', borderRadius: '50%', width: '26px', height: '26px', display: 'inline-block', marginRight: '10px' }}></span>
        <div>
          <div style={{ fontSize: '12px' }}>{siteDomain}</div>
          <div style={{ fontSize: '12px', color: '#5f6368' }}>{displayUrl}</div>
        </div>
      </div>

      {/* Título de Google (Azul) */}
      <h3 style={{
        fontSize: '20px',
        color: '#1a0dab',
        fontWeight: 'normal',
        margin: '5px 0',
        cursor: 'pointer',
        lineHeight: '1.3'
      }}>
        {displayTitle.length > 60 ? displayTitle.substring(0, 57) + '...' : displayTitle}
      </h3>

      {/* Descripción (Gris oscuro) */}
      <div style={{
        fontSize: '14px',
        color: '#4d5156',
        lineHeight: '1.58',
        wordWrap: 'break-word'
      }}>
        {displayDesc.length > 160 ? displayDesc.substring(0, 157) + '...' : displayDesc}
      </div>
    </div>
  );
};

export default GooglePreview;