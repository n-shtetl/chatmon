const sendButton = document.querySelector('#send-but');
const messageBox = document.querySelector('.message-input');
const chatBox = document.querySelector('.chat-page');

const roomLabel = document.getElementById('room-label');
const usersList = document.querySelector('.users-list')

// Get params
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const socket = io();

// join room 
socket.emit('joinRoom', { username, room });

// get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

socket.on('message', msg => {
    outputMessage(msg);

    // autoscroll down to see msg
    chatBox.scrollTop = chatBox.scrollHeight;
})

sendButton.addEventListener('click', (e) => {
    const msg = messageBox.value;
    socket.emit('userMessage', msg);
    messageBox.value = "";
    messageBox.focus();
});

function outputMessage(msg) {
    console.log(msg);
    let newMsg = document.createElement('div')
    newMsg.className = "message";
    newMsg.innerHTML = `<div class="sender-and-timestamp">
                            <div class="sender">${msg.username}</div>
                            <div class="timestamp">${msg.timestamp}</div>
                        </div>
                        <div class="message-content">${msg.msg}</div>`
    chatBox.appendChild(newMsg)
}

// Add room name to DOM
function outputRoomName(room) {
    roomLabel.textContent = room;
}

// add users to DOM 
function outputUsers(users) {
    console.log(users);
    usersList.innerHTML = `
        ${users.map(user => {
            return `<li>${user.username}</li>`
        }).join('')}
    `
}