function App() {
  return (
    // Estas clases de Tailwind: fondo gris, pantalla completa, centrado
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
      
      {/* Texto con gradiente, negrita y sombra */}
      <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
        ¡Logrado!
      </h1>
      
      <p className="text-lg text-slate-300 font-medium tracking-wide">
        React + Vite + Tailwind CSS configurados correctamente.
      </p>

      <div className="mt-8 p-6 bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl">
        <code className="text-purple-400">Practicas 1º DAW - Entorno Listo</code>
      </div>

    </div>
  )
}

export default App