FROM nodered/node-red:latest

ENV TZ=America/Sao_Paulo

# RUN npm install node-red-contrib-modbus
# RUN npm install node-pid-controller
# RUN npm install node-red-contrib-virtuallab

RUN apt-get update && apt-get install -y supervisor
RUN mkdir -p /var/log/supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD ["/usr/bin/supervisord"]