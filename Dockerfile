FROM node:22-alpine AS build
WORKDIR /app
COPY package.json /app
COPY index.js /app/index.js
RUN npm install

FROM node:22-alpine

RUN apk add --no-cache avahi-tools dnsmasq 

COPY dnsmasq.conf /etc/dnsmasq.conf

RUN mkdir -p /mdns-dns
COPY --from=build /app /mdns-dns

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

CMD ["/docker-entrypoint.sh"]
