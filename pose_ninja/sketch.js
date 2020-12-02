//* VARIAVEIS PRO POSENET
var video;
var poseNet;
var pose;


//* VARIAVEL -- NINJA
var ninja;
    //? Animação ninja
    var ninjaAttack, ninjaWalk;

//* VARIAVEL -- INIMIGOS
var enemies, shuriken, enemiesCount = 2;
    //? Animação shuriken
    var shurikenAnimation;

//* TIMER, LEVEL, PONTOS
var timer = 20, level = 1, pontos = 0;

//* VARIAVEL -- TESOURO
var tesouro;
    var tesouroImage;

//* VARIAVEL -- FUNDO
var fundo, lifeImage = [], life = 15, gameOver;

//* VARIAVEL -- FONTE
var pixeledFont;

//* FORÇAR LOOP DA MUSICA
musicLoop = 0;

//* BANCO DE DADOS
var database, highscore;

//! ===================================
//!          FUNÇÃO PRELOAD
//! ===================================
function preload(){
    //? ===================================
    //?         ANIMAÇÕES E IMAGENS
    //? ===================================
    ninjaAttack = loadAnimation('ninjaAttack/ninjaAttack1.png',
                                'ninjaAttack/ninjaAttack1.png',
                                'ninjaAttack/ninjaAttack2.png',
                                'ninjaAttack/ninjaAttack2.png',
                                'ninjaAttack/ninjaAttack3.png',
                                'ninjaAttack/ninjaAttack3.png',
                                'ninjaAttack/ninjaAttack4.png',
                                'ninjaAttack/ninjaAttack4.png',
                                'ninjaAttack/ninjaAttack5.png',
                                'ninjaAttack/ninjaAttack5.png');
    ninjaWalk = loadAnimation('ninjaWalk/ninjaWalk1.png',
                              'ninjaWalk/ninjaWalk2.png',
                              'ninjaWalk/ninjaWalk1.png',
                              'ninjaWalk/ninjaWalk2.png');
    shurikenAnimation = loadAnimation('shuriken/shuriken1.png',
                                      'shuriken/shuriken2.png',
                                      'shuriken/shuriken3.png',
                                      'shuriken/shuriken4.png');
    tesouroImage = loadImage('tesouro.png');

    //? GAME OVER
    gameOver = loadImage('gameOver.png');

    //? BACKGROUND
    fundo = loadImage('cenario.png');

    //? LIFE
    for(let i=1; i<=16; i++){
        lifeImage[i-1] = loadImage('life/life'+i+'.png');
    }

    //? CARREGAR FONTE
    pixeledFont = loadFont('Pixeled.ttf');

    //? CARREGAR SOM
    soundFormats('mp3', 'ogg');
    music = loadSound('backgroundMusic.mp3');
    swordSound = loadSound('swordSound.mp3');
    crash = loadSound('crash.mp3');
    deathSound = loadSound('deathSound.mp3');
    
    //? CARREGAR WEBCAM
    video = createCapture(VIDEO);
    video.hide();

    //? CARREGAR POSENET
    poseNet = ml5.poseNet(video, { inputResolution: 161 }, modelReady);
    poseNet.on('pose', gotPoses);

    //? FIREBASE
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyCqlafRLMFz4aZs9MeMy-FnXlLuBIMkFHQ",
        authDomain: "poseninjahighscore.firebaseapp.com",
        databaseURL: "https://poseninjahighscore.firebaseio.com",
        projectId: "poseninjahighscore",
        storageBucket: "poseninjahighscore.appspot.com",
        messagingSenderId: "172394970599",
        appId: "1:172394970599:web:a31975b566ea44f9e45142"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    database = firebase.database();

    var ref = database.ref('scores');
    ref.on('value', gotData, errData);
}

function gotData(data){
    var scoresArray = data.val();
    var keys = Object.keys(scoresArray);
    console.log(keys);

    /*
    for(let i=0; i<keys.length; i++){
        var k = keys[i];
        var score = scoresArray[k].score;
        console.log(score);
    }
    */

    highscore = scoresArray[keys[0]].score;
    for(let i=0; i<keys.length; i++){
        var k = keys[i];
        if(scoresArray[k].score > highscore) highscore = scoresArray[k].score;
    }
    console.log(highscore);
}

function errData(err){
    console.log('Error!');
    console.log(err);
}

//! ===================================
//!            FUNÇÃO SETUP
//! ===================================
function setup(){
    //* FPS
    frameRate(30); 

    //* CRIAR CANVAS
    createCanvas(500, 500);

    //* SETANDO BAÚ DO TESOURO
    tesouro = createSprite(-25, 200, 100, 40)
    tesouro.addImage(tesouroImage);

    //* SETANDO NINJA
    ninja = createSprite(200, 200, 40, 80);
    ninja.addAnimation('ninjaWalk', ninjaWalk);
    ninja.addAnimation('ninjaAttack', ninjaAttack);

    //* SETANDO GRUPO DE SHURIKENS
    enemies = new Group();

    //* CARREGAR SHURIKENS PELA PRIMEIRA VEZ
    LoadEnemie();

}

//! ===================================
//!            FUNÇÃO DRAW
//! ===================================
function draw(){
    clear();
    noSmooth();

    if(frameCount == 90) music.loop();

    //* ===================================
    //*             WEBCAM
    //* ===================================
    image(video, 0, 0);

    //* TIMER 
    if(frameCount % 20 == 0 && timer > 0) timer--;

    //* BACKGROUND
    if(life > 0) background(fundo);
    else background(gameOver);
    
    //* ===================================
    //*              NINJA
    //* ===================================
    if(pose){
        ninja.position.x = 500-pose.nose.x;
        ninja.position.y = pose.nose.y;
    }

    ninja.friction = 0.4;

    ninja.changeAnimation('ninjaWalk');

    //* ===================================
    //*           BAU DE TESOURO
    //* ===================================
    if(tesouro.position.x <= -25) tesouro.setSpeed(-3, 180);
    else if(tesouro.position.x >= 525) tesouro.setSpeed(3, 180);

    //* ===================================
    //*             SHURIKENS
    //* ===================================
    for(let i=0; i<enemies.size(); i++){
        enemies[i].attractionPoint(0.05+(level*0.0005), tesouro.position.x, tesouro.position.y);
        //* Manter a shuriken no x
        if(enemies[i].position.x <= -10) enemies[i].position.x = 500;
        else if(enemies[i].position.x >= 510) enemies[i].position.x = -10;
    
        //* Manter a shuriken no y
        if(enemies[i].position.y <= -10) enemies[i].position.y = 390;
        else if(enemies[i].position.y >= 390) enemies[i].position.y = -10;
    }

    //* COLISÕES
    enemies.overlap(ninja, ShurikenRemove);
    enemies.overlap(tesouro, CoinRemove);
    
    //* DESENHAR SPRITES
    drawSprites();

    //* ===================================
    //*                HUD
    //* ===================================
    fill(255);
    textSize(25);
    textFont(pixeledFont);
    if(life > 0){
        image(lifeImage[15-life], 0, 370);
        //* Texto level
        text(level, 65, 460);
        //* Texto timer
        text(timer, 180, 460);
        //* Texto pontos
        text(pontos, 280, 460);
    } else {
        textSize(25);
        //* Pontos e highscore
        text("POINTS: " + pontos, 100, 420);
        text("HIGHSCORE: " + highscore, 100, 460);
    }
}

//! ===================================
//!         CARREGAR SHURIKENS
//! ===================================
function LoadEnemie(){
    for(let i=0; i<2*level; i++){
        if(i%2 == 0) shuriken = createSprite(round(random(10, 490)), 10, 50, 50);
            else shuriken = createSprite(round(random(10, 490)), 350, 20, 50);
        shuriken.addAnimation('shurikenAnimation', shurikenAnimation);
        shuriken.setCollider('circle', 0, 0, 20);

        enemies.add(shuriken);
    }
}

//! ===================================
//!          REMOVER SHURIKEN
//! ===================================
function ShurikenRemove(shuriken){
    ninja.changeAnimation('ninjaAttack');
    ninja.animation.looping = false;

    if(ninja.animation.getFrame() == 9){
        shuriken.remove();
        swordSound.play();
        pontos++;
        EnemieCount();
    }
}

//! ===================================
//!            REMOVER LIFE
//! ===================================
function CoinRemove(shuriken){
    life--;
    if(life <= 0){
        enemies.removeSprites();
        tesouro.remove();
        ninja.remove();
        music.stop();
        deathSound.play();

        var data = {
            score: pontos
        }
        var ref = database.ref('scores');
        ref.push(data);
    }
    shuriken.remove();
    crash.play();
    EnemieCount();
}

//! ===================================
//!        CONTADOR DE INIMIGOS
//! ===================================
function EnemieCount(){
    enemiesCount--;
    if(enemiesCount == 0){
        if(timer <= 0){
            level++;
            timer = 20;
        }
        LoadEnemie();
        enemiesCount = 2*level;
    }   
}

//! ===================================
//!              POSENET
//! ===================================
function modelReady(){
    console.log('PoseNet is ready');
}

function gotPoses(poses){
    //console.log(poses);
    if(poses.length > 0){
        pose = poses[0].pose;
        //skeleton = poses[0].skeleton;
    }
}