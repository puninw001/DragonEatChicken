let player;
let enemy;
let isGameover;
let score = 0;
let yourscore = `${score}`;
let vel = 6; 
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
const gameover = () => {
  background(0);
  fill('white');
  textAlign(CENTER);
  vel = 6;
  score = 0;
  text(`Your Score: ${score}`, width / 2, height / 1.6);
  text('GAME OVER',width / 2, height / 2);
  text('press space to restart',width / 2, height / 1.8);
  isGameover = true;
  if(keyCode === 32) {
    isGameover = false;
  }
  for(let i = 0; i < 10; i++) {
    enemy[i].position.y = 1;
  }
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  player = createSprite(width / 2, height - 35, 50, 50);
  enemy = new Group();
  for(let i =0; i < 10; i++) {
    let enemyElement = createSprite(random(0,width),0,20,40);
    enemy[i] = enemyElement;
    enemy[i].vely = random(1,10);
  }
  isGameover = false;
}
function draw() {
  background(30,30,30);
  drawSprites();
  if(isGameover) {
    gameover();
  }else { 
    fill('white');
    textAlign(CENTER);
    text(`score: ${score}`,50,10);
    if(keyDown(RIGHT_ARROW) && player.position.x  < width - 27) {
      player.position.x+=6;
    }
    if(keyDown(LEFT_ARROW) && player.position.x >  27 ) {
     player.position.x-=6;
    }
    if(keyDown(UP_ARROW) && player.position.y >  0 ) {
     player.position.y-=6;
    }
    if(keyDown(DOWN_ARROW) && player.position.y < windowHeight ) {
     player.position.y+=6;
    }
    for(let i = 0; i < 10 ;i++) {
      if(enemy[i].overlap(player)) {
        gameover();
      }
      enemy[i].position.y += enemy[i].vely + vel;
      if(enemy[i].position.y > height) {
        enemy[i].position.y = 0;
        enemy[i].position.x = random(0,width - enemy[i].width);
      }
    }
    score += 10;
    vel+= 0.001;
  }
}