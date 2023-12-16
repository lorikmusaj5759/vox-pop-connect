/* complex_code.js */

// This code is an implementation of a simple chat room system, using Node.js and Express.js

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Data structures to store chat room information
const users = [];
let messages = [];

// Serve static files
app.use(express.static('public'));

// Handle incoming socket connections
io.on('connection', (socket) => {
  console.log('A user connected.');

  // Add user to the chat room
  socket.on('join', (user) => {
    users.push(user);
    socket.username = user;
    socket.emit('update', `Welcome ${user}!`);
    io.emit('update', `${user} has joined the chat room.`);
    io.emit('userList', users);
    io.emit('messageList', messages);
  });

  // Handle incoming chat messages
  socket.on('chat message', (message) => {
    messages.push({ user: socket.username, message });
    io.emit('chat message', { user: socket.username, message });
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    if (socket.username) {
      users.splice(users.indexOf(socket.username), 1);
      io.emit('userList', users);
      io.emit('update', `${socket.username} has left the chat room.`);
    }
    console.log('A user disconnected.');
  });
});

// Start the server
http.listen(3000, () => {
  console.log('Server started on port 3000.');
});
