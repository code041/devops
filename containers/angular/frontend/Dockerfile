FROM node:18-alpine

WORKDIR /app

EXPOSE 4200

COPY package.json package-lock.json ./

RUN npm install 

COPY . ./

CMD ["npm", "start"]
