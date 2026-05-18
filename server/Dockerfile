# 1. Usamos una imagen de Node ligera
FROM node:20-alpine

# 2. Creamos el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiamos los archivos de dependencias
COPY package*.json ./

# 4. Instalamos las dependencias
RUN npm install

# 5. Copiamos el resto del código
COPY . .

# 6. Exponemos el puerto que usa Express
EXPOSE 5000

# 7. Comando para arrancar (usamos nodemon si está en package.json)
CMD ["npm", "run", "dev"]