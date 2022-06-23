# STAGE 0
FROM node AS ui-build
WORKDIR /usr/src/app
COPY client/ ./client/
RUN cd ./client/ && npm install && npm run build


# STAGE 1
FROM node AS server-build
WORKDIR /root/
COPY --from=ui-build /usr/src/app/client/build ./client/build
COPY server/ ./server/
RUN cd ./server && npm install

EXPOSE 8081

WORKDIR /root/server
CMD ["node", "server.js"]
