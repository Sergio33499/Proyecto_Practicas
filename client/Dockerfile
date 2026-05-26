# 1. Imagen de Node
FROM node:20-alpine

# 2. Directorio de trabajo
WORKDIR /app

# 3. Copiamos dependencias
COPY package*.json ./

# 4. Instalamos dependencias
RUN npm install

# 5. Copiamos el código de React/Vite
COPY . .

# 6. Exponemos el puerto de Vite
EXPOSE 5173

# 7. Comando para arrancar el servidor de desarrollo
CMD ["npm", "run", "dev", "--", "--host"]