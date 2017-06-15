let myCanvas = document.getElementById('arena');
myCanvas.width = 500;
let ctx = myCanvas.getContext('2d')
let snakeLength = 4;
let myScore = 0;
let r = 5;
let speed = 100;
let snake;
let direction ="right";
let pause = false;
let foodX, foodY;

// Method to update the score
function displayScore(){
  $('#score').text(myScore);
}

// Figuring out which key was touched
document.onkeydown = (event) => {
  let code = event.keyCode;
  if(code == 37){
    if(direction != 'right'){
      direction = 'left';
    }
  }
  else if(code == 38){
    if(direction != 'up'){
      direction = 'down';
    }
  }
  else if (code == 39){
    if(direction != 'left'){
      direction = 'right';
    }
  }
  else if (code == 40){
    if(direction != 'down'){
      direction = 'up'
    }
  }
  else if (code == 32){
    if(pause == true){
      mInt = setInterval(move, speed);
      pause = false;
      console.log("Pause is ", pause);
    }else{
      clearInterval(mInt);
      pause = true;
      console.log("Pause is ", pause);
    }
  }
}

// HTML5 Canvas code for drawing objects
var drawings = {

   // Method for building each section of the snakes body;
  snake: (x,y) => {
    ctx.beginPath();
    ctx.arc(x*10,y,r,0,2*Math.PI);
    ctx.stroke();
    ctx.fillStyle = "#f7b733";
    ctx.fill();
  },

  // Code for creation of snake at the beginning of the game
  drawSnake: () => {
    snake = [];
    for(let i = snakeLength; i >0; i--){
      snake.push({x:i, y:10})
    }
  },

  food: (x, y) => {
    ctx.beginPath();
    ctx.arc(x*10,y*10,r,0,2*Math.PI);
    ctx.stroke();
    ctx.fillStyle = "#4ABDAC";
    ctx.fill();
  },

  getFoodCoordinates: () => {
    foodX = Math.floor(Math.random() * 49) + 1;
    foodY = Math.floor(Math.random() * 49) + 1;
  },

  drawFood: () => {
    drawings.food(foodX, foodY)
  }



}

// Starting the game
function init(){
  drawings.drawSnake()
  for(let i = 0; i < snake.length; i++){
    drawings.snake(snake[i].x, snake[i].y)
  }
  drawings.getFoodCoordinates();
  drawings.drawFood()
  getScores();
}

// Function for saving high score
function save(){
  $.ajax({
    url:'/score',
    method: 'POST', 
    data: {score: myScore},
    success: (res)=> {
      console.log("Save response is", res);
      // res.sort();
      // $('#high-scores').html('');
      // for(let i = res.length-1; i > -1; i--){
      //   console.log("Score is", res[i])
      //   $('#high-scorse').append('<li>' + res[i] + '</li>');
      // }
    },
    errors: (res) => {

    }
  })
}

function getScores(){
  $.ajax({
    url: '/scores',
    method: 'GET',
    success: (res) => {
      let arr = res;
      arr.sort(function(a,b){return a - b})
      $('#high-scores').html('');
      for(let i = arr.length-1; i > -1; i--){
        $('#high-scores').append('<li style="font-size:25px;"><span class="orange">' + arr[i] + '</span></li>');
      }
    }
  })
}

// Main Function
function move(){
  ctx.clearRect(0,0,500,500)
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,500,500)
  var headX = snake[0].x;
  var headY = snake[0].y;

  // Ending the game if you run into yourself
  for(var i = 1; i < snake.length; i++){
    if(snake[i].x == headX && snake[i].y == headY){
      clearInterval(mInt);
      alert("Game Over. You ran into yourself. Refresh page to play again.")
      save();
    }
  }

  // Ending the game if you run into one of the walls
  if(headX*10 == 500 || headY ==500 || headX == 0 || headY == 0){
    clearInterval(mInt);
    alert("Game Over. You ran into the wall. Refresh page to play again.")
    ctx.clearRect(0,0,500,500)
    save();
  }

  if(direction == 'right'){
    headX++;
  }
  else if(direction == 'left'){
    headX--;
  }

  else if(direction == 'down'){
    headY-=10;
  }

  else if(direction == 'up'){
    headY+=10;
  }

  // If you eat the
  if(headX*10 == foodX*10 && headY == foodY*10){
    myScore++;
    drawings.getFoodCoordinates();
    drawings.drawFood();
    snake.push({x: snake[snake.length-1].x, y:snake[snake.length-1].y }) 
    speed -= 3;
    clearInterval(mInt);
    mInt = setInterval(move, speed);
    displayScore();
  }else{
    snake.pop();
    snake.unshift({x:headX, y:headY});
    drawings.drawFood();
  }



  for(let i = 0; i < snake.length; i++){
    drawings.snake(snake[i].x, snake[i].y)
  }

}

init();
let mInt = setInterval(move, speed);

