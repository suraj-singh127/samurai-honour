const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0,0,canvas.width,canvas.height);

//Gravity for pulling players down
const gravity = 0.7;

const background = new Sprite({
    position : {
        x: 0,
        y: 0
    },
    imageSrc : './img/background.png',
    scale : 1,
    framesMax: 1
})

const Shop = new Sprite({
    position : {
        x: 620,
        y: 130
    },
    imageSrc : './img/shop.png',
    scale: 2.75,
    framesMax: 6,
    framesCurrent: 1,
    frameElapsed: 0,
    framesHold: 8
})

//Player
const player = new Fighter({
    position : {
        x: 200,
        y: 0
    },
    velocity : {
        x: 0,
        y: 10
    },
    color: "red",
    imageSrc: './img/samuraiMack/Idle.png',
    scale: 2.5,
    framesMax: 8,
    frameElapsed: 0,
    framesHold: 8,
    offset : {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc : './img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc : './img/samuraiMack/Jump.png',
            framesMax : 2
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax : 2
        },
        attack: {
            imageSrc: './img/samuraiMack/Attack2.png',
            framesMax : 6
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            framesMax : 4
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax : 6
        }
    },
    attackBox: {
        offset: {
            x: 90,
            y: 70
        },
        width: 150,
        height: 30
    }
});

//The enemy
const enemy = new Fighter({
    position : {
        x: 700,
        y: 400
    },
    velocity : {
        x: 0,
        y: 10
    },
    color : "blue",
    imageSrc: './img/kenji/Idle.png',
    scale: 2.5,
    framesMax: 4,
    frameElapsed: 0,
    frameElapsed: 0,
    framesHold: 8,
    offset : {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc : './img/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc : './img/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc : './img/kenji/Fall.png',
            framesMax: 2
        },
        attack: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax : 4
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            framesMax : 3
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax : 7
        }
    },
    attackBox: {
        offset: {
            x: -160,
            y: 70
        },
        width: 150,
        height: 30
    }
})

//Collision between rectangles
function rectangularCollision({rectangle1,rectangle2}){
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height 
    )
}

const keys = {
    w : {
        pressed: false
    },
    s : {
        pressed: false
    },
    a : {
        pressed: false
    },
    d : {
        pressed: false
    },
    i : {
        pressed: false
    },
    j : {
        pressed: false
    },
    k : {
        pressed: false
    },
    l : {
        pressed: false
    }
}


function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0,0,canvas.width,canvas.height);
    background.update();
    Shop.update();
    c.fillStyle = 'rgba(255,255,255,0.2)';
    c.fillRect(0,0,canvas.width,canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;
    
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5;
        player.switchSprite("run");
    }
    else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5;
        player.switchSprite("run");
    }else{
        player.switchSprite("idle");
    }

    if(player.velocity.y < 0) player.switchSprite("jump");

    if(player.velocity.y > 0) player.switchSprite("fall");
   
    
    //Enemy movement
    if(keys.j.pressed && enemy.lastKey === 'j'){
        enemy.velocity.x = -5;
        enemy.switchSprite("run");
    }
    else if(keys.l.pressed && enemy.lastKey === 'l'){
        enemy.velocity.x = 5;
        enemy.switchSprite("run");
    }
    else{ 
        enemy.switchSprite("idle");
    }


    if(enemy.velocity.y < 0) enemy.switchSprite("jump");
    else if(enemy.velocity.y > 0) enemy.switchSprite("fall");

    //Detecting player collision
    if(rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) &&
     player.isAttacking && player.framesCurrent === 4
    )
    {
        enemy.takeHit();
        player.isAttacking = false;
        document.getElementById('player2Health').style.width = enemy.health + "%";
    }

    //Detecting player collision
    if(rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) &&
     enemy.isAttacking && enemy.framesCurrent === 2
    )
    {
        player.takeHit();
        enemy.isAttacking = false;
        document.getElementById('player1Health').style.width = player.health + "%";
    }

    if(enemy.health <= 0 || player.health<=0) {
        determineWinner({player,enemy,timerId});
    }

}

animate();


//Event listeners for keydown event
window.addEventListener('keydown', (event)=>{

    //Player Movement
    if(!player.dead)
    switch(event.key){
        case 'w':
            keys.w.pressed = true;
            player.velocity.y = -14;
            player.lastKey = 'w';
            break;
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case ' ':
            player.attack();
    }

    //Enemy movement
    if(!enemy.dead)
    switch(event.key){
        case 'i':
            keys.i.pressed = true;
            enemy.velocity.y = -14;
            enemy.lastKey = 'i';
            break;
        case 'j':
            keys.j.pressed = true;
            enemy.lastKey = 'j';
            break;
        case 'l':
            keys.l.pressed = true;
            enemy.lastKey = 'l';
            break;
        case 'k':
            enemy.attack();
    }
});

//Event listener for key down element
window.addEventListener('keyup', (event)=>{
    switch(event.key){
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
    }

    //Enemy movement
    switch(event.key){
        case 'j':
            keys.j.pressed = false;
            break;
        case 'l':
            keys.l.pressed = false;
    }
});

decreaseTimer();
