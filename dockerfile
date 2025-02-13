# Use an official Node.js runtime as a parent image
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the TypeScript application
RUN npm run build

# Use a smaller image for the final container
FROM node:20-alpine AS runner

# Set the working directory
WORKDIR /usr/src/app

# Copy the node_modules and built files from the builder image
COPY --from=builder /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=builder /usr/src/app/dist /usr/src/app/dist

# Set environment variables (if needed)
# ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Run the app
CMD ["node", "dist/index.js"]
