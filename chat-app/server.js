const net = require("net")

const server = net.createServer()

const clients = []

server.on("connection", (serverSoc)=>{
    console.log("A new connection to the server");
    const clientId = clients.length + 1;
    serverSoc.write(`id-${clientId}`)

    clients.map((client)=>{
        client.serverSoc.write(`User ${clientId} joined!`)
    })

    clients.push({ id: clientId.toString(), serverSoc})

    // clients.push(serverSoc)
    serverSoc.on("data", (data)=>{
        const dataString = data.toString("utf-8")
        const id = dataString.substring(0, dataString.indexOf("-"))
        const message = dataString.substring(dataString.indexOf("-message-") + 9)
        clients.map((client)=>{
            client.serverSoc.write(`> User ${id}: ${message}`)
        })
    })
    serverSoc.on("end", ()=>{
        clients.map((client)=>{
            client.serverSoc.write(`User ${clientId} left!`)
        })
    })

    serverSoc.on("error", () => {
    clients.map((client) => {
        client.serverSoc.write(`User ${clientId} left!`);
    });
});
})

server.listen(3008, "127.0.0.1", ()=>{
    console.log("opened server on", server.address());
})