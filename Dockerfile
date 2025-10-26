# Stage 1: Compile and Build Angular codebase
FROM node:18 AS build

WORKDIR /usr/local/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration=production

# Stage 2: Serve app with nginx server
FROM nginx:latest

# Copie du build Angular (à adapter si ton nom de projet change)
COPY --from=build /usr/local/app/dist/talent-plus/browser /usr/share/nginx/html

# Remplace la config Nginx par défaut pour gérer les routes Angular
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
