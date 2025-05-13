# Imagem base com Node.js
FROM node:18-alpine

# Instalar ferramentas necessárias
RUN apk --no-cache add python3 make g++

# Diretório de trabalho
WORKDIR /app

# Copiar arquivos de package.json primeiro
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Instalar dependências (apenas produção no servidor para reduzir tamanho)
RUN npm install && \
    cd server && npm install --only=production && cd .. && \
    cd client && npm install

# Copiar código fonte
COPY . .

# Construir o cliente
RUN cd client && npm run build

# Limpar dependências de desenvolvimento do cliente para reduzir tamanho
RUN cd client && npm prune --production

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=5000

# Expor porta
EXPOSE 5000

# Comando para iniciar o servidor
CMD ["node", "server/server.js"] 