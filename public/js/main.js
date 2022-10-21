const socket = io()
const chatForm = document.getElementById("chat-form")
const chatMsg = document.querySelector('.chat-messages')
const roomName = document.getElementById("room-name")
const userList = document.getElementById('users')

//usernames and rooms
const {username , room} = Qs.parse(location.search , {
    ignoreQueryPrefix : true
})

function outputRoom(room){
    roomName.innerText = room
}

socket.emit("joinRoom" , {username , room})

socket.on("roomUsers" , ({room ,users}) => {
    outputRoom(room)

})

function appendMessage(msg){
    const div = document.createElement("div")
    div.classList.add("message")
    div.innerHTML = `<p class="meta">${msg.username} <span> ${msg.time}</span></p>
    <p class="text">${msg.text}</p>
    `
    document.querySelector(".chat-messages").appendChild(div)
}

socket.on("message" , (data) => {
    console.log(data)
    appendMessage(data)
    //scroll
    chatMsg.scrollTop = chatMsg.scrollHeight
})

chatForm.addEventListener("submit" , (e) => {
    e.preventDefault()

    const msg = e.target.elements.msg.value
    //emit a msg to the server
    socket.emit("chat-msg" , msg)

    e.target.elements.msg.value = ""

})