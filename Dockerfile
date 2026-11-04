FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
# ปรับ PORT ให้ตรงกับที่ app listen
ENV PORT=3333

COPY --from=deps /app/node_modules ./node_modules
COPY . .

USER node
EXPOSE 3333
CMD ["node", "index.js"]