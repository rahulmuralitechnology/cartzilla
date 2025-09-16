FROM node:22.11.0

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build
RUN npm prune --production 

COPY entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

EXPOSE 3007

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
