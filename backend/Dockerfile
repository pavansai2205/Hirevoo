FROM node:18-alpine

WORKDIR /app

# Copy everything at once (simpler, avoids copy issues)
COPY . .

# Install dependencies
RUN npm install --omit=dev

EXPOSE 8000

CMD ["node", "index.js"]