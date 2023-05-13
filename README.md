# rps

I built a thing. Rock, Paper, Scissors in real time, powered by Cloudflare Pages (Jamstack Frontend) and Cloudflare Durable Objects (backend, game state management). Real time communication between the client and server is achieved with Websockets!

## Local Development

Thanks to Miniflare, the entire project can be run locally.

Run the Durable Object that manages game state in local mode.

```shell
cd rps-game-state
npm run start
```

Run the Pages project in local mode.

```shell
npm run start
```