FROM node:18-bullseye

RUN apt-get update && apt-get install -y netcat-traditional dos2unix

WORKDIR /app

COPY package.json package-lock.json ./

COPY .env .

RUN npm install

COPY . .

COPY docker/entrypoint.sh /app/docker/entrypoint.sh

RUN dos2unix /app/docker/entrypoint.sh && chmod +x /app/docker/entrypoint.sh

RUN npm run build

ENTRYPOINT ["docker/entrypoint.sh"]

EXPOSE 3001
CMD ["npm", "run", "start"]