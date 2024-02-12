# nlw-expert-node

Real-time voting system in Node.js with WebSocket

### stacks
- Node.js
- Typescript
- Fastify
- Docker

### databases
- PostgreSQL
- Redis

### configs

> add .env file to configuration database
> 
> obs: your username and password must be the same as those given in the docker-compose.yml file

```
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<databasename>?schema=public"
```

### scripts

```
npm install (install dependencies)

docker compose up -d (run postgres and redis from docker container)

npm run dev
```


credits: this project was developed at NLW Expert - <a href="https://rocketseat.com.br">@Rocketseat</a>
