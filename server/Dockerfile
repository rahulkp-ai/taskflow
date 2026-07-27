FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Make entrypoint executable
RUN chmod +x entrypoint.sh

EXPOSE 5000

ENTRYPOINT ["sh", "entrypoint.sh"]
