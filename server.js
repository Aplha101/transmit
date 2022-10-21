const path = require('path')
const express = require("express")
const http = require('http')
const socketio = require("socket.io")
const formatMessage = require("./utils/messages")
const {userJoin , getCurrentUser , userLeave , getRoomUsers} = require("./utils/users")
const bot = "Nam"

const app = express()
const server = http.createServer(app)
const io = socketio(server)

io.on("connection", (socket) => {

    socket.on("joinRoom" , ({username , room}) => {

        const user = userJoin(socket.id , username , room)

        socket.join(user.room)

    socket.emit('message' , formatMessage(bot,"welcome"))

    // user connected msg GLOBAL
    socket.broadcast.to(user.room).emit("message" , formatMessage(bot, `${user.username} joined the chat`))
        
        io.to(user.room).emit("roomUsers", {room:user.room , users:getRoomUsers(user.room) 
        
        })
    })

    
    //chat messages
    socket.on("chat-msg" , (msg) => {
        const user = getCurrentUser(socket.id)

        io.to(user.room).emit("message" , formatMessage(user.username , msg))
    })
    socket.on("disconnect" , () => {
        const user = userLeave(socket.id)
        if(user){
        io.to(user.room).emit("message" , formatMessage(bot, `${user.username} left the chat`))
        }
    })

})

app.use(express.static(path.join(__dirname, "public")))

const PORT = 3000 || process.env.PORT

server.listen(PORT , () => {
    console.log(`app listening on ${PORT} `)
})
