//For determining winner of the game
function determineWinner({player,enemy,timerId}){
    clearTimeout(timerId);
    let message = document.getElementById('message')
        message.style.display = 'block';
        if(enemy.health === player.health){
            message.innerHTML = "No one takes the Oscar!" 
        }
        else if(enemy.health < player.health){
            message.innerHTML = "Player 1 Wins"
        }
        else{message.innerHTML = "Player 2 Wins"}
}

//Timer for the game
let time = 60;
let timerId;
function decreaseTimer(){
    if(time > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        time--;
        document.querySelector('.timer').innerHTML = time;
    }
    else {
        determineWinner({player,enemy,timerId});
    }
}