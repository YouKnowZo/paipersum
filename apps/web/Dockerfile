FROM node:20-alpine as build
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm i || true
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /srv
RUN npm i -g serve
COPY --from=build /app/dist ./dist
EXPOSE 4173
CMD ["serve","-s","dist","-l","4173"]
