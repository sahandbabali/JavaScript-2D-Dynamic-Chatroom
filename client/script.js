let userslistgrp = document.getElementById("userslistgrp")
let msginput = document.getElementById("msginput")
let sendbtn = document.getElementById("sendbtn")

let onlinecounter = document.getElementById("onlinecounter")
const stepsize = 10

let gamestate = []


let socket = io('http://localhost:5000')

socket.on('connect', () => {
    // connected to server


})


socket.on('roomstate-onconnection', (roomstate) => {
    console.log(roomstate)

    // update online user counter
    onlinecounter.innerText = roomstate.length

    userslistgrp.innerHTML = ""
    // update sidebar ui
    for (let index = 0; index < roomstate.length; index++) {
        // add socket.id to sidebar
        userslistgrp.innerHTML += `
    
        <li class="list-group-item" style="background-color: ${roomstate[index].color}">

    <p class="text-truncate"> <i class="bi bi-person-fill"></i>  ${roomstate[index].id}  </p>
   
    </li>
    `

    }

    // update gamestate
    gamestate = [...roomstate]

})


socket.on('get-roomstate', (roomstate) => {
    // console.log(roomstate)

    // update gamestate
    gamestate = [...roomstate]

})



document.getElementById('messageForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission behavior


    // send message to server
    let message = msginput.value

    if (message.length > 0) {
        socket.emit('text-message', message, socket.id)

        msginput.value = ''
    }



});






function setup() {
    // Get the offsetWidth of the #canvasbox div
    let canvasboxWidth = document.getElementById('canvasbox').offsetWidth;

    // Create a canvas with the width of the #canvasbox div and a fixed height of 700px
    let cnv = createCanvas(canvasboxWidth, 600);
    cnv.parent('canvasbox');
}

function draw() {
    background(220);


    if (keyIsDown(UP_ARROW)) {
        // Code to run as long as the UP arrow key is down
        console.log("UP arrow key held down");
        socket.emit('movementy', -stepsize, socket.id);
    }

    // Check if the DOWN arrow key is being held down
    if (keyIsDown(DOWN_ARROW)) {
        // Code to run as long as the DOWN arrow key is down
        console.log("DOWN arrow key held down");
        socket.emit('movementy', stepsize, socket.id);
    }

    // Check if the LEFT arrow key is being held down
    if (keyIsDown(LEFT_ARROW)) {
        // Code to run as long as the LEFT arrow key is down
        console.log("LEFT arrow key held down");
        socket.emit('movementx', -stepsize, socket.id);
    }

    // Check if the RIGHT arrow key is being held down
    if (keyIsDown(RIGHT_ARROW)) {
        // Code to run as long as the RIGHT arrow key is down
        console.log("RIGHT arrow key held down");
        socket.emit('movementx', stepsize, socket.id);
    }




    // draw game state
    for (let index = 0; index < gamestate.length; index++) {
        fill(gamestate[index].color);

        circle(gamestate[index].posx, gamestate[index].posy, 20)


        const startIdx = Math.max(0, gamestate[index].messages.length - 3);
        for (let i = gamestate[index].messages.length - 1; i >= startIdx; i--) {
            // Draw a white rectangle as background for each message
            fill(gamestate[index].color);
            const rectWidth = textWidth(gamestate[index].messages[i]) + 20; // Add some padding
            const rectHeight = 25; // Adjust as needed

            // Calculate the position of the rectangle
            const rectX = gamestate[index].posx - rectWidth / 2;
            const rectY = gamestate[index].posy - 30 * (gamestate[index].messages.length - i) - rectHeight / 2;

            rect(rectX, rectY, rectWidth, rectHeight);

            // Draw the message text inside the rectangle with a larger text size
            fill(0); // Set the text color to black
            textSize(18); // Set the text size to 18 pixels
            textAlign(CENTER, CENTER); // Align text to the center of the rectangle
            let message = gamestate[index].messages[i];
            text(message, rectX + rectWidth / 2, rectY + rectHeight / 2);
        }

    }
}



