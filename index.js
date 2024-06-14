const {Server} = require('socket.io');

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

const io  = new Server(port, {
    cors: {
        // origin: "http://127.0.0.1:5500"
        origin: "https://mechatfront.onrender.com"
    }
});

const users = {};

io.on('connection', socket=>{
    socket.on('new-user-joined', name=>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    })

    socket.on('send', message=>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    })

    socket.on('disconnect', message=>{
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
    })
})