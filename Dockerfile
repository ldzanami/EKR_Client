# ---------- build ----------
FROM node:20-alpine AS build
WORKDIR /src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# ---------- runtime ----------
FROM nginx:alpine
COPY --from=build /src/app/dist/* /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]