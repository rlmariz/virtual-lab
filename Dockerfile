FROM nodered/node-red:latest
ENV TZ=America/Sao_Paulo
RUN npm install node-red-contrib-modbus
RUN npm install node-pid-controller