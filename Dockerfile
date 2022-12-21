FROM node:19-alpine
WORKDIR /app
ENV PATH="./node_modules/.bin:$PATH"
ENV NODE_ENV="production"
COPY package.json .
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "run", "server"];