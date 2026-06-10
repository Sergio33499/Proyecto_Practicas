import React from 'react';

export default function AnuncioSkeleton() {
  return (
    <div className="bg-white rounded-xl h-52 border border-gray-100 p-4 animate-pulse flex flex-col justify-between shadow-sm">
      <div className="space-y-3">
        {/* Simulación de las etiquetas superiores (Tipo y Modalidad) */}
        <div className="flex gap-2">
          <div className="h-5 bg-gray-200 rounded-full w-16"></div>
          <div className="h-5 bg-gray-200 rounded-full w-16"></div>
        </div>
        
        {/* Simulación del Título */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mt-2"></div>
        
        {/* Simulación de la Descripción (dos líneas) */}
        <div className="space-y-2 pt-1">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>

      {/* Simulación de la botonera inferior */}
      <div className="flex justify-end gap-2 pt-3 border-t border-gray-50">
        <div className="h-7 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
}