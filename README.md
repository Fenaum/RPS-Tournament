# RPS-Tournament

Rock paper scissors tournament app built with plain JavaScript and Socket.IO.

## Run locally

Install dependencies once:

```bash
cd server && npm install
cd ../client && npm install
```

Start the websocket server:

```bash
cd server
PORT=3100 node server.js
```

Start the browser client:

```bash
cd client
npm run start
```

Open `http://localhost:8081`. The client connects to `http://localhost:3100`
by default. To override it from the page, set `window.RPS_SOCKET_URL` before
`socket.js` loads.
