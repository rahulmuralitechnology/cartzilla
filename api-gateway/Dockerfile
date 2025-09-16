FROM node:22.11.0

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /usr/src/app/logs

RUN npm run build

# Remove devDependencies after build
RUN npm prune --production

EXPOSE 3000

CMD ["npm", "start"]
