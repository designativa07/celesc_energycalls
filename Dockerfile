# Imagem base com Node.js
FROM node:18-alpine as build

# Diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./

# Instalar dependências do projeto principal
RUN npm install

# Copiar arquivos do servidor
COPY server/package*.json ./server/
RUN cd server && npm install

# Copiar arquivos do cliente
COPY client/package*.json ./client/
RUN cd client && npm install

# Copiar o resto dos arquivos
COPY . .

# Construir o cliente
RUN npm run build

# Imagem final
FROM node:18-alpine

WORKDIR /app

# Copiar apenas os arquivos necessários da etapa de build
COPY --from=build /app/package*.json ./
COPY --from=build /app/server ./server
COPY --from=build /app/client/build ./client/build

# Instalar apenas dependências de produção
RUN npm install --production

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=5000

# Expor porta
EXPOSE 5000

# Comando para iniciar o servidor
CMD ["npm", "start"] 