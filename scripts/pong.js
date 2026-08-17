import player from "/player.json" with {type : "json"}
import ball from "/ball.json" with {type : "json"}

const playerSpeed = document.getElementById("playerSpeed")
const currentSpeed = document.getElementById("currentSpeed")
let gameSpeed = playerSpeed.value


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
const canvasWidth = 1100;
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

// ENEMY ISNTANTIATION
const player2 = {
    ...player,
    x : canvasWidth - 50,
    y : canvasHeight / 3 ,
    color : 'red'
}

// --------------------- INITIAL VALUES
// start of game (MUST ALWAYS BE OUTSIDE OF GAMELOOP)
    player.x = canvasWidth / 5
    player.y = canvasHeight / 3

    ball.x = canvasWidth / 2 + 60
    ball.y = canvasHeight / 3 + 50

// --------------------- MAIN GAME LOOP
function gameLoop(){
    // background
    ctx.fillStyle = "black"
    ctx.fillRect(150,0,canvasWidth,canvasHeight)

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.y <= 0) {
    ball.velocityY *= -1;
    }

    if (ball.y + ball.size >= canvas.height) {
    ball.velocityY *= -1;
    }

    if (ball.y + ball.size >= canvas.width) {
    ball.velocityY *= -1;
    }


    // drawPlayer
    drawObject(player)
    drawObject(player2)
    drawObject(ball)
    requestAnimationFrame(gameLoop)
}
gameLoop()

// eventListeners
window.addEventListener("keydown", function(event) {
if(event.key === "ArrowDown"){
    player.y += 10 * gameSpeed;

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
    player.y -= 10 * gameSpeed;

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