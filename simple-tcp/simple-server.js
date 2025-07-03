const net = require("net");

const server = net.createServer((socket)=>{
    socket.on("data", (chunk)=>{
        console.log(chunk.toString("utf-8")); 
    })
})

server.listen(3099, "127.0.0.1", ()=>{
    console.log("opened server on", server.address());
    
})