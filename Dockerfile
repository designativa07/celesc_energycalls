# Imagem base com Node.js
FROM node:16

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

# Copiar todo o código fonte
COPY . .

# Instalar dependências raiz, evitando o script install que causa recursão
RUN npm ci --ignore-scripts

# Instalar dependências do servidor e do cliente separadamente
RUN cd server && npm ci
RUN cd client && npm ci

# Construir o cliente
RUN cd client && npm run build

# Expor porta
EXPOSE 5000

# Comando para iniciar o servidor
CMD ["node", "server/server.js"] 