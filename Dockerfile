FROM node:18-alpine

# Create and set the working directory
RUN mkdir /backend
WORKDIR /backend

COPY package.json ./
COPY package-lock.json ./

# Install node dependencies
RUN npm ci

COPY ./server ./server
COPY ./scripts ./scripts
COPY ./config ./config
COPY ./utilities ./utilities

COPY ./index.js ./

ARG SERVER_PORT=8080
# Make the server port available to the world outside this container
EXPOSE ${SERVER_PORT}

# Run the start script when the container launches
CMD ["npm", "run", "start:prod"]
