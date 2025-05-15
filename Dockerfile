# Imagem base com Node.js LTS
FROM node:16-alpine

# Instalar ferramentas necessárias para builds
RUN apk --no-cache add python3 make g++

# Configurar variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=5000
ENV DB_HOST=postgres
ENV DB_PORT=5432
ENV DB_NAME=energycalls
ENV DB_USER=energycalls
ENV DB_PASSWORD=MKHV392AMAbegHH
ENV JWT_SECRET=celesc_energy_calls_secure_token_2025
ENV JWT_EXPIRES_IN=24h

# Diretório de trabalho
WORKDIR /app

# Copiar os arquivos package.json primeiro para melhor uso de cache
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Instalar dependências do servidor e do projeto principal
RUN npm install --ignore-scripts && \
    cd server && npm install --only=production && \
    cd ../client && npm install

# Copiar o restante do código fonte
COPY . .

# Construir o frontend
WORKDIR /app/client
RUN npm run build

# Voltar para o diretório principal
WORKDIR /app

# Expor porta
EXPOSE 5000

# Comando para iniciar o servidor
CMD ["node", "server/server.js"] 