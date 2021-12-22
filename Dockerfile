FROM node:12

WORKDIR /app

ENV TZ="Asia/Shanghai"

COPY . .

RUN npm install --registry=https://registry.npm.taobao.org

RUN npm run build

EXPOSE 7001

CMD ["npm", "run", "online"]