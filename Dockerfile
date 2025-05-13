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

# Instalar dependências e construir
RUN npm install && \
    cd server && npm install && cd .. && \
    cd client && npm install && npm run build

# Expor porta
EXPOSE 5000

# Comando para iniciar o servidor
CMD ["node", "server/server.js"] 