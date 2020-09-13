### STAGE 1: Build ###
FROM node:12.7-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

### STAGE 2: Run ###
FROM nginx:1.19.2

COPY nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /usr/src/app/dist/BusinessControlV3 /usr/share/nginx/html

EXPOSE $PORT

CMD /bin/bash -c "envsubst '\$PORT' < /etc/nginx/nginx.conf > /etc/nginx/nginx.conf " && nginx -g 'daemon off;'
