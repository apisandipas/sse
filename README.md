# sse

This is a demo of Server Sent Events streaming point cloud coordinates from the backend. 
It also demonstrates how values can update from the front end and be applied to the stream by closing and reopening the EventSource connection to the Server.

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
