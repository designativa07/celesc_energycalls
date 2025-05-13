# Imagem base com Node.js
FROM node:18-alpine

# Instalar ferramentas necessárias
RUN apk --no-cache add python3 make g++

# Diretório de trabalho
WORKDIR /app

# Copiar todo o código fonte
COPY . .

# Instalar dependências e construir
RUN npm install --production=false && \
    cd server && npm install --production=false && cd .. && \
    cd client && npm install --production=false && npm run build && cd ..

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=5000

# Expor porta
EXPOSE 5000

# Comando para iniciar o servidor
CMD ["node", "server/server.js"] 