const socket = new WebSocket("ws://localhost:3000")

socket.addEventListener("open", ()=>{
    console.log("Connected to Server")
});

socket.addEventListener("close", ()=>{
    console.log("Disconnected to Server")
})

import player from "/player.json" with {type : "json"}
import ball from "/ball.json" with {type : "json"}
import { type } from "node:os";

// Difficulty Buttons Container
const diffButtons = document.getElementById("diffButtons")
// Diff Buttons
const easy = document.getElementById("easyButton")
const medium = document.getElementById("mediumButton")
const hard = document.getElementById("hardButton")

// Game States
const GAME_STATES = {
    MENU : "menu",
    PLAYING : "playing",
    PAUSED : "paused",
    GAME_OVER : "gameOver"
}

function resetButtons(){
    [easy,medium,hard].forEach(button => {
        button.classList.remove("isSelected")
        button.classList.remove("isInactive")

    });
}
// Check which button is clicked
diffButtons.addEventListener('click', function(event){
    if(event.target.tagName === "BUTTON"){

        const clickedButtonId = event.target.id

        if(clickedButtonId === "easyButton"){
            resetButtons()
            
            gameSpeed = 2
            gameDiff = "easy"
            easy.classList.add("isSelected")
            medium.classList.add("isInactive")
            hard.classList.add("isInactive")

            medium.disabled = true
            hard.disabled = true

        }
         if(clickedButtonId === "mediumButton"){
            resetButtons()

            gameSpeed = 3
            gameDiff = "medium"
            easy.classList.remove("isInactive")
            medium.classList.add("isSelected")
            hard.classList.add("isInactive")

            easy.disabled = true
            hard.disabled = true
        }
         if(clickedButtonId === "hardButton"){
            resetButtons()

            gameSpeed = 5
            gameDiff = "hard"
            easy.classList.add("isInactive")
            medium.classList.add("isInactive")
            hard.classList.add("isSelected")

            easy.disabled = true
            medium.disabled = true
        }
    }
})

// Tracker
let gameRunning = false;
let gameState = GAME_STATES.MENU
let gameDiff = ""

let isPaused = false

// Game Speed
const playerSpeed = document.getElementById("playerSpeed")
const currentSpeed = document.getElementById("currentSpeed")
let gameSpeed = 0

// score Counter
const scores = [0,0]
const playerScore = document.getElementById("playerScore")
const enemyScore = document.getElementById("enemyScore")

// FOR TESTING PURPOSES
// // Speed Dragger
// currentSpeed.innerHTML = 
// `Current Speed: ${playerSpeed.value}`

// playerSpeed.addEventListener('input', ()=>{
//     currentSpeed.innerText = 
//     `Current Speed: ${playerSpeed.value}`
//     gameSpeed = playerSpeed.value

// })


// CANVAS CONSTANS
const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")
const canvasHeight = 500;
const canvasWidth = 850;

canvas.width = canvasWidth;
canvas.height = canvasHeight;


// DRAWING OBJECTS
function drawObject(object){
    ctx.fillStyle = object.color

    ctx.fillRect(
        object.x ,
        object.y ,
        object.width,
        object.height,
    )


}

// BOT SPEED
function checkSpeed(gameDiff){
    
    if(gameDiff === "easy"){
        this.speed = 2
    }
    if(gameDiff === "medium"){
        this.speed = 3
    }
    if(gameDiff === "hard"){
        this.speed = 5
    }

}
// Start ball (random trajectory)
function startBall(){

    ball.x = canvasWidth / 2 - ball.size / 2;
    ball.y = canvasHeight / 2 - ball.size / 2;

    ball.velocityX = Math.random() < 0.5 ? -5 : 5;
    ball.velocityY = Math.random() < 0.5 ? -5 : 5;
}


// PADDLE COLLISION
function checkCollision(ball,paddle){
    return(
        ball.x < paddle.x + paddle.width &&
        ball.x + ball.size > paddle.x &&
        ball.y < paddle.y + paddle.height &&
        ball.y + ball.size > paddle.y
    )
}

function checkScore(ball){
    
    // BALL GETS ON LEFT SIDE
    if(ball.x <= 0){
        scores[1] += 1
        enemyScore.innerText =
        `${scores[1]}`
        // startBall()
    }

    // BALL GETS ON RIGHT SIDE
    if(ball.x + ball.size >= canvas.width){
        scores[0] += 1
        playerScore.innerText =
        `${scores[0]}`
    }
}

// FOR PAUSING PURPOSES
let startingVelocityX = 0;
let startingVelocityY = 0;

function pauseGame(){
  
    startingVelocityX = ball.velocityX
    startingVelocityY = ball.velocityY

    ball.velocityX = 0
    ball.velocityY = 0

}

function startGame(){
    ball.velocityX = startingVelocityX
    ball.velocityY = startingVelocityY
}

// Check user and A.I Points
function checkPoints(){
    if(scores[0] >= 15){
        ctx.fillStyle = "black"
        ctx.fillRect(0,0,canvasWidth,canvasHeight)

        ctx.font = "20px Arial"
        ctx.fillStyle = "#ffffff"
        ctx.textAlign = "center";     // Centers text horizontally on the X coordinate
        ctx.textBaseline = "middle";  // Centers text vertically on the Y coordinate
        ctx.fillText("You Won, Congratulations!", canvas.width / 2 , canvas.height / 2 )

        gameState = GAME_STATES.GAME_OVER
    }

    if(scores[1] >= 15){
        ctx.fillStyle = "black"
        ctx.fillRect(0,0,canvasWidth,canvasHeight)

        ctx.font = "20px Arial"
        ctx.fillStyle = "#ffffff"
        ctx.textAlign = "center";     // Centers text horizontally on the X coordinate
        ctx.textBaseline = "middle";  // Centers text vertically on the Y coordinate
        ctx.fillText("Sorry, You Lost", canvas.width / 2 , canvas.height / 2 )
    
        gameState = GAME_STATES.GAME_OVER
    }
}

// ENEMY INSTANTIATION
const player2 = {
    ...player,
    x : canvas.width - 50,
    y : canvas.height / 2 - player.height / 2,
    color : 'red',
    speed : checkSpeed(gameDiff)
    
    
}

// --------------------- INITIAL VALUES
// start of game (MUST ALWAYS BE OUTSIDE OF GAMELOOP)
    player.x = 50
    player.y = canvas.height / 2 - player.height / 2

let lastTime = 0

let showDiffWarning = false
// --------------------- MAIN GAME LOOP
function gameLoop(timestamp){
    // calculate deltatime (since last frame)
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp

    // prevent skippings
    if(deltaTime > 100) deltaTime = 16.67

    // scales movemnt by monitor refresh rate
    let dtMultiplier = deltaTime / 16.67

    checkPoints()
    if(gameState === "menu"){
        ctx.fillStyle = "black"
        ctx.fillRect(0,0,canvasWidth,canvasHeight)

        ctx.font = "20px Arial"
        ctx.fillStyle = "#ffffff"
        ctx.textAlign = "center";     // Centers text horizontally on the X coordinate
        ctx.textBaseline = "middle";  // Centers text vertically on the Y coordinate
        ctx.fillText("Select a Difficulty ", canvas.width / 2 , canvas.height / 2 - 50 )
        ctx.fillText("and Press Enter to Start", canvas.width / 2 , canvas.height / 2 )

        if(showDiffWarning){
            ctx.fillText("Please Select a Difficulty", canvas.width / 2 , canvas.height / 2 + 50 )
        }
    }

    if(gameState === "paused"){
        ctx.fillStyle = "black"

        ctx.font = "20px Arial"
        ctx.fillStyle = "#ffffff"
        ctx.textAlign = "center";     // Centers text horizontally on the X coordinate
        ctx.textBaseline = "middle";  // Centers text vertically on the Y coordinate
        ctx.fillText("Game is Paused", canvas.width / 2 , canvas.height / 2 )
    }
    
    if(gameState === "playing"){
        // background
        ctx.fillStyle = "black"
        ctx.fillRect(0,0,canvasWidth,canvasHeight)

        ball.x += (ball.velocityX * gameSpeed) * dtMultiplier;
        ball.y += (ball.velocityY * gameSpeed) * dtMultiplier;

        checkScore(ball)

        if(checkCollision(ball, player)){
            ball.x = player.x + player.width;
            ball.velocityX *= -1;
        }

        if (checkCollision(ball, player2)) {
        ball.x = player2.x - ball.size;
        ball.velocityX *= -1;
        }

        if (ball.y <= 0) {
            ball.y = 0;
            ball.velocityY *= -1;
        }

        if (ball.y + ball.size >= canvas.height) {
            ball.y = canvas.height - ball.size;
            ball.velocityY *= -1;
        }

        if (ball.x <= 0) {
            ball.x = 0;
            ball.velocityX *= -1;
        }

        if (ball.x + ball.size >= canvas.width) {
            ball.x = canvas.width - ball.size;
            ball.velocityX *= -1;
        }

        // drawPlayer
        drawObject(player)
        drawObject(player2)
        drawObject(ball)
    }
    
    if(gameState === "gameOver"){
        cancelAnimationFrame(gameLoop)
        gameRunning = false;
    }

    console.log(gameState)
    
    requestAnimationFrame(gameLoop)
}

// eventListeners
window.addEventListener("keydown", function(event) {

// PLAYER MOVEMENTS
    if(event.key === "ArrowUp"){
    // player.y -= 30 * gameSpeed;

    // if(player.y < 0){
    //     player.y = 0
    // }
    // // console.log(player.y)
    // event.preventDefault()

    socket.send(JSON.stringify({
        type : "input",
        key : "up",
        pressed : true
    }))
    }
    if(event.key === "ArrowDown"){

    // player.y += 30 * gameSpeed + 2;

    //  if(player.y < 0){
    //     player.y = 0
    // }

    // if (player.y + player.height > canvas.height) {
    //     player.y = canvas.height - player.height;
    // }
    // console.log(player.y)
    // event.preventDefault()

    socket.send(JSON.stringify({
        type : "input",
        key : "down",
        pressed : true
    }))

    }

// RELOAD BROWSER
    if(event.shiftKey && event.key.toLowerCase() === 'r'){
        location.reload()
        }
         if(event.code === "Space" && gameRunning){
        isPaused = !isPaused;

        if(isPaused){
            gameState = GAME_STATES.PAUSED
            pauseGame()

        }else{
            gameState = GAME_STATES.PLAYING
            startGame()
        }
    }

// START GAME
    if(event.key === "Enter" && !gameRunning){
        
        if(gameSpeed == 0){
            showDiffWarning = true
           return;
        }
        
        showDiffWarning = false;

        gameState = GAME_STATES.PLAYING
        gameRunning = true;
        startBall()

        // lastTime
        lastTime = performance.now()
    }

})

window.addEventListener("keyup", function(event){

    if(event.key === "ArrowUp"){

        socket.send(JSON.stringify({
            type : "input",
            key : "up",
            pressed : false
        }));
    }

    if(event.key === "ArrowDown"){
        
        socket.send(JSON.stringify({
            type : "input",
            key : "up",
            pressed : false
        }))
    }
});

// Load the js as soon as the screen loads
requestAnimationFrame(gameLoop)
