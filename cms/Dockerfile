FROM node:22.11.0 AS build


# Accept build-time environment variables
ARG VITE_API_BACKEND_API
ARG VITE_API_ENV

# Make them available to the build process
ENV VITE_API_BACKEND_API=${VITE_API_BACKEND_API}
ENV VITE_API_ENV=${VITE_API_ENV}

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
