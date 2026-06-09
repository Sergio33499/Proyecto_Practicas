# IEShare Betxí 🚀
> Plataforma de Intercambio de Material y Conocimiento del IES de Betxí.
> Proyecto desarrollado para el módulo de FCT / Proyecto de DAW (120-130 horas).

## 🛠️ Stack Tecnológico
* **Frontend:** React.js (Vite) + Tailwind CSS + React Router
* **Backend:** Node.js + Express.js + Nodemailer (Gmail API Auth)
* **Base de Datos:** MongoDB Atlas + Mongoose
* **Infraestructura:** Docker & Docker Compose

## 🚀 Cómo arrancar el proyecto en Local

Sigue estos pasos para levantar todo el entorno de desarrollo automatizado en contenedores Docker:

1. **Clonar el repositorio y acceder a la carpeta:**
   ```bash
   cd /mnt/c/Users/sergi/Proyecto_Practicas

   ## 🔑 Configuración del Entorno (.env)

El proyecto requiere de dos archivos `.env` configurados correctamente:

### En la carpeta `/server/.env`:
* `MONGO_URI`: URL de conexión a tu base de datos de MongoDB Atlas.
* `JWT_SECRET`: Clave secreta aleatoria para firmar los tokens de sesión.
* `EMAIL_USER`: Correo de la aplicación (`iesharebetxi@gmail.com`).
* `EMAIL_PASS`: Contraseña de aplicación de 16 letras generada en Google.
* `FRONTEND_URL`: URL del cliente (por defecto `http://localhost:5173`).

### En la carpeta `/client/.env`:
* `VITE_BACKEND_URL`: URL del servidor Node (por defecto `http://localhost:5000`).