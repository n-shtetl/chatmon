const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages.js')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users.js');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = 'ChatMonBot'

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        console.log(socket.id);
        socket.join(user.room);
        // Welcome current user
        socket.emit('message', formatMessage(botName,'Welcome to ChatMon'))

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage(botName,`${username} has joined the chat.`))
        
        // broadcast room users
        io.to(user.room).emit('roomUsers', { 
           room: user.room, 
           users: getRoomUsers(user.room) 
        })
    })

    
    // broadcast user disconnect
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        console.log(user,socket.id);
        if (user) {
            io.to(user.room)
              .emit('message', formatMessage(botName,`${user.username} has left the chat`))
            io.to(user.room).emit('roomUsers', { 
                room: user.room, 
                users: getRoomUsers(user.room) 
            })
        }
        
        
    })

    // Catch user messages
    socket.on('userMessage', (msg) => {
        console.log(socket.id)
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })
})


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})