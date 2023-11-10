
let roomstate = []


const io = require('socket.io')(5000, {
    cors: {
        origin: ['http://127.0.0.1:5500']
    },
    path: '/socket.io'
})

io.on('connection', socket => {
    console.log(`${socket.id} connected`)

    // add connected user to roomstate
    roomstate.push({
        id: socket.id,
        color: generateRandomLightColor(),
        posx: Math.floor(Math.random() * (500 - 0 + 1)) + 0,
        posy: Math.floor(Math.random() * (500 - 0 + 1)) + 0,
        messages: []

    })

    io.emit('roomstate-onconnection', roomstate)



    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
        // Perform any cleanup or additional actions upon disconnection
        roomstate = removeObjectById(roomstate, socket.id);

        io.emit('roomstate-onconnection', roomstate)
    });




    socket.on('movementy', (movement, sendid) => {

        // change roomstate
        roomstate.find(obj => obj.id === sendid).posy += movement



        io.emit('get-roomstate', roomstate)

    })
    socket.on('movementx', (movement, sendid) => {

        roomstate.find(obj => obj.id === sendid).posx += movement

        io.emit('get-roomstate', roomstate)

    })




    socket.on('text-message', (message, sendid) => {
        console.log(`${message} from ${sendid}`)

        // update roomstate - add message to users object
        roomstate.find(obj => obj.id === sendid).messages.push(message)

        // to be added
        // remove from previous messages if array is longer than lets say 3



        io.emit('get-roomstate', roomstate)

    })


})




function removeObjectById(arrayOfObjects, targetId) {

    if (arrayOfObjects.length == 0) {
        return arrayOfObjects
    }
    // Find the index of the object with the matching id
    const indexToRemove = arrayOfObjects.findIndex(obj => obj.id === targetId);

    // Check if the object with the specified id was found
    if (indexToRemove !== -1) {
        // Remove the object from the array
        arrayOfObjects.splice(indexToRemove, 1);
        console.log(`Object with id ${targetId} removed successfully.`);
    } else {
        console.log(`Object with id ${targetId} not found.`);
    }

    // Return the updated array
    return arrayOfObjects;
}


function generateRandomLightColor() {
    const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    // Generate RGB values for a light and vibrant color
    const red = randomInRange(150, 255);
    const green = randomInRange(150, 255);
    const blue = randomInRange(150, 255);

    // Return the generated color in hexadecimal format
    const hexColor = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
    return hexColor;
}


