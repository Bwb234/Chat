const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Store the connected clients
const clients = {};

// Generate a random username
function generateUsername() {
  return 'User' + Math.floor(Math.random() * 10000);
}

io.on('connection', socket => {
  // Generate a username for the connected client
  const username = generateUsername();
  clients[socket.id] = username;

  // Emit the username to the client
  socket.emit('username', username);

  // Handle incoming messages
  socket.on('message', message => {
    // Broadcast the message to all connected clients
    io.emit('message', { username, message });
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    // Remove the client from the clients object
    delete clients[socket.id];
  });
});

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
