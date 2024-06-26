const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameover.mp3');
const moveSound = new Audio('move.mp3');
const musicSound = new Audio('music.mp3');
let direction = {x:0, y:0};
let speed = 5;
let inputDir = {x:0, y:0};
let lastPaintTime = 0;
let board = document.getElementById("board");
let snakeArr = [{x:13,y:13}];
let score = 0;
let scoreDiv = document.getElementById("score");
let food = {x:12, y:17};
let poisonedFood = {x:8, y:4}; 
let goldenFood = {x:100, y:5}; 
let timedOut = false; 
//Game Functions
function main(ctime){
    window.requestAnimationFrame(main);
    musicSound.play();
    if((ctime - lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime = ctime;

    gameEngine();
}

function isColloid(snakeArr){
    //If you bump into yourself
    for(let i = 1; i<snakeArr.length;i++){
        if(snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y ){
            return true;
        }
    }
    // If you collide with wall
    if(snakeArr[0].x >= 22 || snakeArr[0].x <=0 || snakeArr[0].y >= 22 || snakeArr[0].y <=0 ){
        return true;
    }
}

function suicide(snakeArr){
  if(snakeArr[0].x === poisonedFood.x && snakeArr[0].y === poisonedFood.y){
    return true;
  }  
}

function heaven(){
    if(snakeArr[0].y === goldenFood.y && snakeArr[0].x === goldenFood.x){
        foodSound.play();
        score +=5;
        scoreDiv.innerHTML = "Score: " + score;
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
        let a = 2;
        let b = 20;
        food = {x: Math.round(a + (b-a)*Math.random()),y: Math.round(a + (b-a)*Math.random())};
        poisonedFood = {x: Math.round(a + (b-a)*Math.random()),y: Math.round(a + (b-a)*Math.random())};
        
        //Increasing speed of snake after eating 5 apples
        
        if(score!=0 && score%5==0){
            speed+=1;
        }
    }
}
function gameEngine(){
    if(score!=0 && score%5==0 && score%10!=0 && timedOut == false){
        heaven();
    }

    //Part 1: Updating snake array & food
    if(isColloid(snakeArr) || suicide(snakeArr)){
        gameOverSound.play();
        musicSound.pause();
        inputDir = {x:0, y:0};
        alert("Game over press any key to play again");
        snakeArr = [{x:13,y:13}];
        score = 0;
        scoreDiv.innerHTML = "Score: " + score;
        speed = 5;
    }

    // If you have eaten the food, Increment the score and regenerate food
    if(snakeArr[0].y === food.y && snakeArr[0].x === food.x){
        foodSound.play();
        score +=1;
        scoreDiv.innerHTML = "Score: " + score;
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
        let a = 2;
        let b = 20;
        food = {x: Math.round(a + (b-a)*Math.random()),y: Math.round(a + (b-a)*Math.random())};
        poisonedFood = {x: Math.round(a + (b-a)*Math.random()),y: Math.round(a + (b-a)*Math.random())};
        timedOut = false;
        //Increasing speed of snake after eating 5 apples
        
        if(score!=0 && score%5==0){
            speed+=1;
        }

        //Generating golden food
        
        goldenFood = {x: Math.round(a + (b-a)*Math.random()),y: Math.round(a + (b-a)*Math.random())};
        
    }


    //Moving the snake
    for(let i = snakeArr.length-2;i >= 0; i--){
        snakeArr[i+1] = {...snakeArr[i]};    
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    //Part 2: Display snake array and food
    //Display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index)=>{
        snakeElement = document.createElement('div');
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.style.gridRowStart = e.y;
        if(index === 0){
            snakeElement.classList.add('head');
        }else{
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    })

    //Display the food
        foodElement = document.createElement('div');
        foodElement.style.gridColumnStart = food.x;
        foodElement.style.gridRowStart = food.y;
        foodElement.classList.add('food');
        board.appendChild(foodElement);

    //Display poisoned food
    if(food != poisonedFood){
        poisonedFoodElement = document.createElement('div');
        poisonedFoodElement.style.gridColumnStart = poisonedFood.x;
        poisonedFoodElement.style.gridRowStart = poisonedFood.y;
        poisonedFoodElement.classList.add('poisonedFood');
        board.appendChild(poisonedFoodElement);
    }

    //Display golden food
        if(score!=0 && score%5==0 && score%10!=0 && timedOut == false){
        goldenFoodElement = document.createElement('div');
        goldenFoodElement.style.gridColumnStart = goldenFood.x;
        goldenFoodElement.style.gridRowStart = goldenFood.y;
        goldenFoodElement.classList.add('goldenFood');
        board.appendChild(goldenFoodElement);
        
    // Setting time for eating golden food 5 seconds if player can't eat in 5 seconds the golden apple will disappered
        setTimeout(()=>{
            goldenFoodElement.remove();
            timedOut = true;
        },5000)
        }


}



//Main logic starts here
window.requestAnimationFrame(main);
window.addEventListener('keydown', e =>{
    inputDir = {x:0, y:0};  //Start game
    moveSound.play();
    switch (e.key){
        case 'ArrowLeft':
            console.log("ArrowLeft");
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case 'ArrowUp':
            console.log("ArrowUp");
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case 'ArrowRight':
            console.log("ArrowRight");
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        case 'ArrowDown':
            console.log("ArrowDown");
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        default:
            break;
    }
});