//biblioteca de fisica
//cria o objeto a gente já diz quais são as propriedades do objeto

//namespace: renomear as partes da biblioteca
const Engine = Matter.Engine; //mecanismo de fisica: são as leis que regem o mundo
const World = Matter.World; //mundo onde estão as leis
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world, backgroundImg,
waterSound,
pirateLaughSound,
backgroundMusic,
cannonExplosion;
var canvas, angle, tower, ground, cannon, boat;
var balls = [];
var boats = [];
var score = 0;
var boatAnimation = [];
var boatSpritedata, boatSpritesheet;

var brokenBoatAnimation = [];
var brokenBoatSpritedata, brokenBoatSpritesheet;

var waterSplashAnimation = [];
var waterSplashSpritedata, waterSplashSpritesheet;

var isGameOver = false;
var isLaughing= false;

var timer = 200;

var alunos = ["Maria", "João", "Ana"]

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  backgroundMusic = loadSound("./assets/background_music.mp3");
  waterSound = loadSound("./assets/cannon_water.mp3");
  pirateLaughSound = loadSound("./assets/pirate_laugh.mp3");
  cannonExplosion = loadSound("./assets/cannon_explosion.mp3");
  towerImage = loadImage("./assets/tower.png");
  boatSpritedata = loadJSON("assets/boat/boat.json");
  boatSpritesheet = loadImage("assets/boat/boat.png");
  brokenBoatSpritedata = loadJSON("assets/boat/broken_boat.json");
  brokenBoatSpritesheet = loadImage("assets/boat/broken_boat.png");
  waterSplashSpritedata = loadJSON("assets/water_splash/water_splash.json");
  waterSplashSpritesheet = loadImage("assets/water_splash/water_splash.png");
}

function setup() {
  canvas = createCanvas(1200,600);
  engine = Engine.create(); //cria o mecanismo de fisica e guarda numa variável
  world = engine.world; //renomeando o mundo que é criado a partir do mecanismo
  angleMode(DEGREES); //para usar angulos em graus
  angle = 15

  alunos.push("Antonio")
  for(var i = 0; i < alunos.length; i++){
    console.log(alunos[i])
  }

  //JSON
  ground = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true });
  World.add(world, ground); //adicionar ao mundo (mundo, objeto)

  tower = Bodies.rectangle(160, 350, 160, 310, { isStatic: true });
  World.add(world, tower);

  cannon = new Cannon(180, 110, 100, 50, angle);

  var boatFrames = boatSpritedata.frames;
  for (var i = 0; i < boatFrames.length; i++) {
    var pos = boatFrames[i].position;
    var img = boatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(img);
  }

  var brokenBoatFrames = brokenBoatSpritedata.frames;
  for (var i = 0; i < brokenBoatFrames.length; i++) {
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    brokenBoatAnimation.push(img);
  }

  var waterSplashFrames = waterSplashSpritedata.frames;
  for (var i = 0; i < waterSplashFrames.length; i++) {
    var pos = waterSplashFrames[i].position;
    var img = waterSplashSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    waterSplashAnimation.push(img);
  }
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);
  //console.log(timer)

  if(timer <= 50){
    timer++;
  }

  console.log(balls.length)
  /*if (!backgroundMusic.isPlaying()) {
    backgroundMusic.play();
    backgroundMusic.setVolume(0.1);
  }*/

  Engine.update(engine);
 
  //push(): empurra uma configuração para o código
  push();
  translate(ground.position.x, ground.position.y); //transladar
  fill("brown");
  rectMode(CENTER);//desenhar a partir do centro
  rect(0, 0, width * 2, 1);
  pop();
  //pop(): retira a configuração

  push();
  translate(tower.position.x, tower.position.y);
  rotate(tower.angle);
  imageMode(CENTER);
  image(towerImage, 0, 0, 160, 310);
  pop();

  showBoats();

   for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
    collisionWithBoat(i);
  }

  cannon.display();
  

  fill("#6d4c41");
  textSize(40);
  text(`Pontuação: ${score}`, width - 200, 50);
  textAlign(CENTER, CENTER);
}

function collisionWithBoat(index) {
  for (var i = 0; i < boats.length; i++) {
    if (balls[index] !== undefined && boats[i] !== undefined) {
      var collision = Matter.SAT.collides(balls[index].body, boats[i].body);

      if (collision.collided) {
        score+=5
        boats[i].life -= 30;
        Matter.World.remove(world, balls[index].body);
        delete balls[index];

        if(boats[i].life <= 0){
          boats[i].remove(i);
        }
      }
    }
  }
}

function keyPressed() {
  if (keyCode === DOWN_ARROW && timer >= 50) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

function showCannonBalls(ball, index) {
  if (ball) {
    ball.display();
    ball.animate();
    if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
     // waterSound.play()  
      ball.remove(index);
      
    }
  }
}

function showBoats() {
  if (boats.length > 0) {
    if (
      boats.length < 4 &&
      boats[boats.length - 1].body.position.x < width - 300
    ) {
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      var boat = new Boat(
        width,
        height - 100,
        170,
        170,
        position,
        boatAnimation
      );

      boats.push(boat);
      
    }

    for (var i = 0; i < boats.length; i++) {
      Matter.Body.setVelocity(boats[i].body, {
        x: -0.9,
        y: 0
      });

      boats[i].display();
      boats[i].animate();
      boats[i].showLife();
      var collision = Matter.SAT.collides(this.tower, boats[i].body);
      if (collision.collided && !boats[i].isBroken) {
          //Adicionar a sinalização isLaughing e a configuração isLaughing para true
          if(!isLaughing && !pirateLaughSound.isPlaying()){
            pirateLaughSound.play();
            isLaughing = true
          }
        isGameOver = true;
        gameOver();
      }
    }
  } else {
    var boat = new Boat(width, height - 60, 170, 170, -60, boatAnimation);
    boats.push(boat);
  }
}

function keyReleased() {
  if (keyCode === DOWN_ARROW && !isGameOver && timer >= 50) {
   // cannonExplosion.play();
    balls[balls.length - 1].shoot();
    timer = 0;
   
  }
}

function gameOver() {
  swal(
    {
      title: `Fim de Jogo!!!`,
      text: "Obrigada por jogar!!",
      imageUrl:
        "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
      imageSize: "150x150",
      confirmButtonText: "Jogar Novamente"
    },
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}

function Soma(x, y){
  var resultado = x + y;
  return(resultado);
}
