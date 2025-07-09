// const net = require("net")
// const fs = require("fs/promises")

// const server = net.createServer(()=>{})

// let fileHandle, fileStream;

// server.on("connection", (serverSoc)=>{
//     console.log("New connection")

//     // Tha data is a buffer, coming from the client
//     // and the socket is a duplex stream
//     serverSoc.on("data", async (data)=>{
//         fileHandle = await fs.open(`storage/test.txt`, "w")
//         fileStream = fileHandle.createWriteStream();
//         fileStream.write(data)
//     })

//     serverSoc.on("end", ()=>{
//         console.log("Connection ended!")
//         fileHandle.close();
//     })
// })

// server.listen(5050, "::1", ()=>{
//     console.log("Uploader server open on", server.address());
// })



const net = require("net")
const fs = require("fs/promises")


const server = net.createServer(()=>{})

server.on("connection", (serverSoc)=>{
    console.log("New connection")
    
    // Declare fileHandle in a higher scope so it's accessible in both callbacks
    let fileHandle, fileWriteStream;

    serverSoc.on("data", async (data)=>{
        if (!fileHandle) {
            serverSoc.pause()

            const indexOfDivider = data.indexOf("-------")
            const fileName = data.subarray(10, indexOfDivider).toString("utf-8")


            fileHandle = await fs.open(`storage/${fileName}`, "w")
            fileWriteStream = fileHandle.createWriteStream();
            if(!fileWriteStream.write(data.subarray(indexOfDivider +7))){
                serverSoc.pause()
            }else{
                serverSoc.resume()
            }

            fileWriteStream.on("drain", ()=>{
                serverSoc.resume()
            })
        } else {
            if(!fileWriteStream.write(data)){
                serverSoc.pause()
            }
        }
    })

    serverSoc.on("end", async ()=>{
        console.log("Connection ended!")
        if (fileHandle) {
            await fileHandle.close();
        }
    })

    // Handle errors to prevent crashes
    serverSoc.on("error", (err) => {
        console.error("Socket error:", err)
        if (fileHandle) {
            fileHandle.close().catch(console.error)
        }
    })
})

server.listen(5050, "::1", ()=>{
    console.log("Uploader server open on", server.address());
})