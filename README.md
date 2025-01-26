# sse

## Development Setup
To setup make sure docker daemon is running and run:

```sh
docker-compose -f docker-compose.dev.yml up --build
```

To run any new migrations run:

``` sh
docker exec -it sse-server-1 npx prisma migrate dev
```


## Test Production Setup

``` sh
docker-compose -f docker-compose.prod.yml up --build
```
