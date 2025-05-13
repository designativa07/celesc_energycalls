# Imagem base com Node.js LTS
FROM node:16-alpine

# Configurar variáveis de ambiente básicas
ENV NODE_ENV=production
ENV PORT=5000

# Diretório de trabalho
WORKDIR /app

# Copiar todo o código fonte
COPY . .

# Instalar apenas as dependências do servidor
RUN cd server && npm ci --only=production

# Expor porta
EXPOSE 5000

# Comando para iniciar o servidor
CMD ["node", "server/server.js"] 