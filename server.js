const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const uuid = require('uuid').v4;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve the frontend HTML, CSS, JS
app.use(express.static('public'));

// When a new WebSocket connection is made
wss.on('connection', (ws) => {
    // When a message is received from the client
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'join':
                // When a user joins a room, broadcast to all users in the room
                ws.room = data.room;
                break;
            case 'offer':
                // Send offer to the recipient
                broadcast(ws.room, data);
                break;
            case 'answer':
                // Send answer to the recipient
                broadcast(ws.room, data);
                break;
            case 'candidate':
                // Send ICE candidate to the recipient
                broadcast(ws.room, data);
                break;
            default:
                break;
        }
    });

    // Broadcast message to all clients in the room
    function broadcast(room, message) {
        wss.clients.forEach(client => {
            if (client !== ws && client.room === room) {
                client.send(JSON.stringify(message));
            }
        });
    }

    // Clean up when the client disconnects
    ws.on('close', () => {
        wss.clients.forEach(client => {
            if (client.room === ws.room) {
                client.send(JSON.stringify({ type: 'disconnect', room: ws.room }));
            }
        });
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server running on port 3000');
});
