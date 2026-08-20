import express from 'express'
import http from 'http'
import WebSocket from 'ws'

const app = express()
const PORT = 3000

app.use(express.static("public"))

const server = http.createServer(app)

const wss = new WebSocket.Server({
    server
});

wss.on("connection", (socket) =>{
    console.log("Player Connected")

    socket.on("message", (message) =>{
        const data = JSON.parse(message);

        console.log(data)
    });

    socket.on("close", ()=>{
        console.log("Player Disconnected")
    });
});

server.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`)
})