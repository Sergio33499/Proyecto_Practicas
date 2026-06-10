import React from 'react';

export default function AnuncioFormModal({ 
  isOpen, onClose, onSubmit, editandoId, enviando,
  titulo, setTitulo, descripcion, setDescripcion, tipo, setTipo, modalidad, setModalidad 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            {editandoId ? '✏️ Editar tu anuncio' : '📢 Publicar un nuevo anuncio'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título del anuncio</label>
            <input
              type="text" required value={titulo} onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Libro de Sistemas Informáticos - 1º DAW"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción detallada</label>
            <textarea
              required value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe el estado del material..."
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 h-24 bg-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option value="MATERIAL">Material (Market)</option>
                <option value="CONOCIMIENTO">Conocimiento (Skill-Sharing)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">¿Qué necesitas?</label>
              <select value={modalidad} onChange={(e) => setModalidad(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option value="OFREZCO">Ofrezco</option>
                <option value="BUSCO">Busco</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-md">
              Cancelar
            </button>
            <button
              type="submit" disabled={enviando}
              className={`px-4 py-2 text-white text-xs font-semibold rounded-md shadow-sm disabled:bg-gray-400 ${editandoId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {enviando ? 'Guardando...' : editandoId ? 'Guardar Cambios' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}