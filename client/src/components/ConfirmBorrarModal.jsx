import React from 'react';

export default function ConfirmBorrarModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl border border-gray-100">
        <div className="flex items-center gap-3 text-red-600 mb-3">
          <span className="text-2xl">⚠️</span>
          <h3 className="text-lg font-bold text-gray-900">¿Eliminar anuncio?</h3>
        </div>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          ¿Estás seguro de que deseas eliminar este anuncio de forma permanente? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-md">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md shadow-sm">Sí, Eliminar</button>
        </div>
      </div>
    </div>
  );
}