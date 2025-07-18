'use strict';

let usernamePage = document.querySelector("#username-page");
let chatPage = document.querySelector("#chat-page");
let usernameForm = document.querySelector("#usernameForm");
let messageArea = document.querySelector("#messageArea");
let messageForm = document.querySelector("#messageForm");
let messageInput = document.querySelector("#message");
let connecting = document.querySelector(".connecting"); 

let stompClient = null;
let username = null;
let colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function connect(event){
    username = document.querySelector('#name').value.trim();
    if(username){
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        let socket= new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({},onConnected, onError);
    }
    event.preventDefault();
}

function onConnected(){
    // subscribe to the public topic
    stompClient.subscribe('/topic/public', onMessageReceived);

    //tell username to the server
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify(
            {
                sender: username,
                type: 'JOIN'
            })
    );

    connecting.classList.add('hidden');
}

function onError() {
    connectingElement.textContent = 'could not connect to WebSocket server. Please refresh this page and try!';

    connecting.style.color = 'red';
}

function onMessageReceived(payload) {
    let message = JSON.parse(payload.body);
    console.log("Message received:", message);
    let messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } else {
        messageElement.classList.add('chat-message');

        let avatarElement = document.createElement('i');
        let avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        let usernameElement = document.createElement('span');
        let usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    let textElement = document.createElement('p');
    let messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}


function getAvatarColor(messageSender) {
    let hash = 0;
    for (let i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    let index = Math.abs(hash % colors.length);
    return colors[index];
}

function sendMessage(event) {
    let messageContent = messageInput.value.trim();
    if(messageContent && stompClient){
        let chatMessage = {
            sender: username,
            content: messageContent,
            type: 'CHAT'
        };
        stompClient.send(
            '/app/chat.sendMessage',
            {},
            JSON.stringify(chatMessage)
        );
        messageInput.value = '';
    }
    event.preventDefault();
}

document.addEventListener('DOMContentLoaded', function () {
    usernameForm.addEventListener('submit', connect, true);
});
messageForm.addEventListener('submit', sendMessage,true);