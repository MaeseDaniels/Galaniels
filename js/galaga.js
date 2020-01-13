let canvas = document.getElementById("canvas");
let ctx = null;
let ctxWidth = canvas.width;
let ctxHeight = canvas.height;
let gameInterval = null;
let ctxBackground = new Image();

let leftButton = document.getElementsByClassName("leftButton")[0];
let rightButton = document.getElementsByClassName("rightButton")[0];
let shotButton = document.getElementsByClassName("shotButton")[0];

let laser = {
  posX: 0,
  posY: 0,
  speed: 8,
  width: 20,
  height: 52,
  countAnimations: 0

}

let enemy = {
  posX: 0,
  posY: 0,
  speed: 1,
  width: 60,
  height: 40,
  isDead: false,
  countAnimations: 0,
  vSpeed: 5
}

let spaceCraft = {
  width: 100,
  height: 150,
  posY: 780,
  posX: 485,
  sprites: {
    'idle':[new Image(), new Image()],
    'left':[new Image(), new Image(), new Image(), new Image()],
    'idle-left':[new Image(), new Image()],
    'right':[new Image(), new Image(), new Image(), new Image()],
    'idle-right':[new Image(), new Image()],
  },
  countAnimations: 0, 
  state: 'idle',
  move: '',
  shots: []
}

let nEnemies = 40;

let enemies = []; 

let enemiesMove = 'right';


let laserAnimation = [new Image(), new Image(), new Image(), new Image(), new Image()];

let enemyAnimation = [new Image(), new Image()];



ctxBackground.src = "./assets/space/backgrounds/desert-backgorund.png";
spaceCraft.sprites['idle'][0].src="./assets/space/spritesheets/spacecraft.png";
spaceCraft.sprites['idle'][1].src="./assets/space/spritesheets/spacecraft2.png";
spaceCraft.sprites['left'][0].src="./assets/space/spritesheets/spacecraftL.png";
spaceCraft.sprites['left'][1].src="./assets/space/spritesheets/spacecraftL2.png";
spaceCraft.sprites['left'][2].src="./assets/space/spritesheets/spacecraftL3.png";
spaceCraft.sprites['left'][3].src="./assets/space/spritesheets/spacecraftL4.png";
spaceCraft.sprites['idle-left'][0].src="./assets/space/spritesheets/spacecraftIL.png";
spaceCraft.sprites['idle-left'][1].src="./assets/space/spritesheets/spacecraftIL2.png";
spaceCraft.sprites['right'][0].src="./assets/space/spritesheets/spacecraftR.png";
spaceCraft.sprites['right'][1].src="./assets/space/spritesheets/spacecraftR2.png";
spaceCraft.sprites['right'][2].src="./assets/space/spritesheets/spacecraftR3.png";
spaceCraft.sprites['right'][3].src="./assets/space/spritesheets/spacecraftR4.png";
spaceCraft.sprites['idle-right'][0].src="./assets/space/spritesheets/spacecraftIR.png";
spaceCraft.sprites['idle-right'][1].src="./assets/space/spritesheets/spacecraftIR2.png";
laserAnimation[0].src = "./assets/space/spritesheets/Laser.png";
laserAnimation[1].src = "./assets/space/spritesheets/Laser2.png";
laserAnimation[2].src = "./assets/space/spritesheets/Laser3.png";
laserAnimation[3].src = "./assets/space/spritesheets/Laser4.png";
laserAnimation[4].src = "./assets/space/spritesheets/Laser5.png";
enemyAnimation[0].src = "./assets/space/spritesheets/enemy.png";
enemyAnimation[1].src = "./assets/space/spritesheets/enemy2.png";


generateEnemies();


if(canvas.getContext) {
  
  ctx = canvas.getContext("2d");
}


gameInterval = setInterval(()=>{
  ctx.clearRect(0, 0, 1024, 960);
  renderBackground();
  renderSpaceCraft();
  renderSpaceCraftShots();
  renderEnemies();
  compHit();
  compLose();
  
}, 16.66);



function renderBackground(){
  ctx.drawImage(ctxBackground, 0, 0, 1024, 960);

}

function renderSpaceCraft() {
  ctx.drawImage(spaceCraft.sprites[spaceCraft.state][spaceCraft.countAnimations],spaceCraft.posX,spaceCraft.posY, spaceCraft.width, spaceCraft.height)

  spaceCraft.countAnimations+=1;
  if(spaceCraft.countAnimations >= spaceCraft.sprites[spaceCraft.state].length){
    if(spaceCraft.state == 'right'){
      spaceCraft.state = 'idle-right';
    }
    if(spaceCraft.state == 'left'){
      spaceCraft.state = 'idle-left';
    }
    spaceCraft.countAnimations = 0;
  }

  if(spaceCraft.move == 'left') {
    spaceCraft.posX -= 5;
    if(spaceCraft.posX <= 0) {
     spaceCraft.posX= 0;
    }
 }
 if(spaceCraft.move == 'right') {
    spaceCraft.posX += 5;
    if(spaceCraft.posX >= (ctxWidth - (spaceCraft.width))) {
      spaceCraft.posX= (ctxWidth - (spaceCraft.width));
    }
  }
}

function renderSpaceCraftShots() {
  for(i = 0; i < spaceCraft.shots.length; i++) {
    
    ctx.drawImage(laserAnimation[spaceCraft.shots[i].countAnimations], spaceCraft.shots[i].posX, spaceCraft.shots[i].posY, spaceCraft.shots[i].width, spaceCraft.shots[i].height);

    

    spaceCraft.shots[i].countAnimations +=1;
    if(spaceCraft.shots[i].countAnimations >= laserAnimation.length){
      spaceCraft.shots[i].countAnimations = 0;
    }
    spaceCraft.shots[i].posY -= spaceCraft.shots[i].speed;
    if(spaceCraft.shots[i].posY <= 0) {
      spaceCraft.shots.splice(i, 1);
    }
  }
}

function renderEnemies() {
  for(let i = 0; i < enemies.length; i++) {
    for(let j = 0; j < enemies[i].length; j++) {
      if(!enemies[i][j].isDead){
        ctx.drawImage(enemyAnimation[enemies[i][j].countAnimations], enemies[i][j].posX, enemies[i][j].posY, enemies[i][j].width, enemies[i][j].height);
        enemies[i][j].countAnimations+=1;
        if(enemies[i][j].countAnimations >= enemyAnimation.length){
          enemies[i][j].countAnimations = 0;
        }
      }
      if(enemiesMove == 'right'){
        enemies[i][j].posX += enemies[i][j].speed;
      }
      if(enemiesMove == 'left'){
        enemies[i][j].posX -= enemies[i][j].speed;
      }

    }

    
  }

  if(enemiesMove == 'right'){
      
    if(enemies[0][enemies[0].length-1].posX >= ctxWidth - enemies[0][0].width) {
      enemies[0][enemies[0].length-1].posX = ctxWidth - enemies[0][0].width;
      enemiesMove = 'left';
      for(let i = 0; i < enemies.length; i++) {
        for(let j = 0; j < enemies[i].length; j++) {
          enemies[i][j].posY += enemies[i][j].vSpeed;
          enemies[i][j].vSpeed += 1;
        }
      }
    }
  }
  if(enemiesMove == 'left'){
    if(enemies[0][0].posX <= 0){
      enemies[0][0].posX = 0;
      enemiesMove = 'right';
      for(let i = 0; i < enemies.length; i++) {
        for(let j = 0; j < enemies[i].length; j++) {
          enemies[i][j].posY += enemies[i][j].vSpeed;
          enemies[i][j].vSpeed += 2;

        }
      }
    }
  }

}



function spaceCraftShot() {
  let shot = {...laser};
  shot.posX = (spaceCraft.posX +40);
  shot.posY = (spaceCraft.posY);
  spaceCraft.shots.push(shot);
}
// spaceCraft.shots[s].posY <= (enemies[i][j].posY + enemies[i][j].height) && spaceCraft.shots[s].posY >= enemies[i][j].posY
function compHit() {
  for(let s = 0; s < spaceCraft.shots.length; s++){
    
    for(let i = 0; i < enemies.length; i++){
      for(let j = 0; j < enemies[i].length; j++){
        if(!enemies[i][j].isDead){
          if(spaceCraft.shots[s].posX >= enemies[i][j].posX && spaceCraft.shots[s].posX <= (enemies[i][j].posX + enemies[i][j].width)){
            if(spaceCraft.shots[s].posY <= (enemies[i][j].posY + enemies[i][j].height) && spaceCraft.shots[s].posY >= enemies[i][j].posY){
              console.log("hit");
              nEnemies--;
              enemies[i][j].isDead= true;
              spaceCraft.shots.splice(s, 1);
              if(nEnemies <= 0){
                alert("youWin!");
                clearInterval(gameInterval);
              }
              break;
            }
          }
        }
      }
    }

  }
}

function compLose() {
  let comp = true;
  let isDead = false;
  let contAliveEnemies = 0;
  for(let i = enemies.length-1;comp && !isDead && i >= 0; i-- ){
    contAliveEnemies = 0;
    for(let j = 0; j < enemies[i].length && comp && !isDead; j++){
      if(!enemies[i][j].isDead){
        contAliveEnemies++;

        if(enemies[i][j].posY >= spaceCraft.posY){
          isDead = true;
          clearInterval(gameInterval);
          alert("youLose!");
        }
      }
      
    }
    if(contAliveEnemies > 0){
      comp = false;
    }
  }
}

function turnLeft(){
  spaceCraft.countAnimations = 0;
  spaceCraft.state = 'left';
  spaceCraft.move = 'left';
}

function turnRight() {
  spaceCraft.countAnimations = 0;
  spaceCraft.state = 'right';
  spaceCraft.move = 'right';
}

function returnToIdle() {
  spaceCraft.countAnimations = 0;
  spaceCraft.state = 'idle';
  spaceCraft.move = '';
}

window.onkeydown = e =>{
  if((e.key == 'ArrowLeft' || e.key == 'a') 
    && spaceCraft.state != 'left' 
    && spaceCraft.state != 'idle-left'){
    turnLeft();

  }
  if((e.key == 'ArrowRight' || e.key == 'd') 
    && spaceCraft.state != 'right' 
    && spaceCraft.state != 'idle-right'){

    turnRight();
  }

  
}


window.onkeyup = e =>{
  if((e.key == 'ArrowLeft' || e.key == 'a') 
    && (spaceCraft.state == 'left' || spaceCraft.state == 'idle-left')){

    returnToIdle();
  }
  if((e.key == 'ArrowRight' || e.key == 'd') 
    && (spaceCraft.state == 'right' || spaceCraft.state == 'idle-right')){

    returnToIdle();
  }
  if(e.key == ' ') {
    spaceCraftShot();
  }
}



leftButton.onmousedown = () => {
  turnLeft();
}

leftButton.onmouseup = () => {
  returnToIdle();
}

rightButton.onmousedown = () => {
  turnRight();
}

rightButton.onmouseup = () => {
  returnToIdle();
}

shotButton.onmousedown = () => {
  spaceCraftShot();
}

function generateEnemies() {
  for(let i = 0; i < nEnemies/10; i++) {
    enemies.push([]);
    for(let j = 0; j < 10; j++) {
      enemies[i][j] = {...enemy};
      enemies[i][j].posX = ((j* 100) + 20);
      enemies[i][j].posY = i* 60;
    }
  }
}