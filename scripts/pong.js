import player from "/player.json" with {type : "json"}
import ball from "/ball.json" with {type : "json"}

// Tracker
let gameRunning = false;

// Game Speed
const playerSpeed = document.getElementById("playerSpeed")
const currentSpeed = document.getElementById("currentSpeed")
let gameSpeed = playerSpeed.value

// score Counter
const scores = [0,0]
const playerScore = document.getElementById("playerScore")
const enemyScore = document.getElementById("enemyScore")

// Ball Starting Position
const startingPosition = Math.floor(Math.random() * 10 + 1)

// Speed Dragger
currentSpeed.innerHTML = 
`Current Speed: ${playerSpeed.value}`

playerSpeed.addEventListener('input', ()=>{
    currentSpeed.innerText = 
    `Current Speed: ${playerSpeed.value}`

    gameSpeed = playerSpeed.value

})

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
        startBall()
        
    }

    // BALL GETS ON RIGHT SIDE
    if(ball.x + ball.size >= canvas.width){
        scores[0] += 1
        playerScore.innerText =
        `${scores[0]}`
    }
}

// ENEMY INSTANTIATION
const player2 = {
    ...player,
    x : canvasWidth - 50,
    y : canvasHeight / 3 + player.height / 2,
    color : 'red'
}

// --------------------- INITIAL VALUES
// start of game (MUST ALWAYS BE OUTSIDE OF GAMELOOP)
    player.x = 50
    player.y = canvasHeight / 3 + player.height / 2


// --------------------- MAIN GAME LOOP
function gameLoop(){
    // background
    ctx.fillStyle = "black"
    ctx.fillRect(0,0,canvasWidth,canvasHeight)

    ball.x += ball.velocityX * gameSpeed;
    ball.y += ball.velocityY * gameSpeed;

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
    requestAnimationFrame(gameLoop)
}

ctx.fillStyle = "black"
ctx.fillRect(0,0,canvasWidth,canvasHeight)

ctx.font = "20px Arial"
ctx.fillStyle = "#ffffff"
ctx.textAlign = "center";     // Centers text horizontally on the X coordinate
ctx.textBaseline = "middle";  // Centers text vertically on the Y coordinate
ctx.fillText("Press Enter to Start", canvas.width / 2 , canvas.height / 2 )

window.addEventListener("keydown" ,function(event){
    if(event.key === "Enter" && !gameRunning){
        gameRunning = true;
        startBall()
        gameLoop()
    }
})


// eventListeners
window.addEventListener("keydown", function(event) {
if(event.key === "ArrowDown"){
    player.y += 30 * gameSpeed + 2;

     if(player.y < 0){
        player.y = 0
    }


    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }

        console.log(player.y)

    event.preventDefault()
}
})

window.addEventListener("keydown", function(event) {
if(event.key === "ArrowUp"){
    player.y -= 30 * gameSpeed;

    if(player.y < 0){
        player.y = 0
    }
    // console.log(player.y)

    event.preventDefault()
}
})

window.addEventListener("keydown", function(event) {
    if(event.shiftKey && event.key.toLowerCase() === 'r'){
        location.reload()
    }
})