FROM node:latest

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# Exposer le port sur lequel Vite servira l'application
EXPOSE 5173

# Commande pour lancer l'application en mode développement
CMD ["npm", "run", "dev"]
