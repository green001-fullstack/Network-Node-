const net = require("net")
const fs = require("fs/promises")
const { createReadStream } = require("fs")
const path = require("path")

const clearLine = (dir) =>{
    return new Promise ((resolve, reject)=>{
        process.stdout.clearLine(dir, ()=>{
            resolve();
        })
    })
}

const moveCursor = (dx, dy) =>{
    return new Promise ((resolve, reject)=>{
        process.stdout.moveCursor(dx, dy, ()=>{
            resolve()
        })
    })
}

let bytesUploaded = 0;
let uploadedPercentage = 0;

const socket = net.createConnection({host:"::1", port: 5050}, async()=>{
    const filePath = process.argv[2]
    // const filePath = "text.txt"
    const fileName = path.basename(filePath)
    const fileHandle = await fs.open(filePath, "r")
    const fileReadStream = fileHandle.createReadStream()
    const fileSize = (await fileHandle.stat()).size

    socket.write(`fileName: ${fileName}-------`)

    fileReadStream.on("data", async(data)=>{
        if(!socket.write(data)){
            fileReadStream.pause()
        }

        bytesUploaded += data.length;
        const newPercentage = Math.floor((bytesUploaded / fileSize)*100);

        if(newPercentage > uploadedPercentage){
        uploadedPercentage = newPercentage;
        console.log()
        await moveCursor(0, -1)
        await clearLine(0)
        console.log(`Uploading...${uploadedPercentage}`)
    }
    })


    socket.on("drain", ()=>{
        fileReadStream.resume()
    })

    fileReadStream.on("end", ()=>{
        console.log("The file was successfully uploaded!")
        socket.end()
    })
})