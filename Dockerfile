# neurolearn-web/Dockerfile

# 1. Use a lightweight Node.js image
FROM node:20-slim

# 2. Set the working directory
WORKDIR /app

# 3. Copy package files first (better caching)
COPY package*.json ./

# 4. Install dependencies
RUN rm -rf package-lock.json node_modules
RUN npm install --legacy-peer-deps

# 5. Copy the rest of the application
COPY . .

# 6. Build the Next.js app
RUN npm run build

# 7. Start the app
CMD ["npm", "start"]