let bg_music = new Sound("sound/bgmusic.mp3",true,"my_bg_music");
let start_sound = new Sound("sound/car_start.mp3",false,"mygamesound",false);
let get_point = new Sound("sound/get_point.mp3",false,"mygamesound",false);
let crash = new Sound("sound/crash.mp3",false,"mygamesound",false);
bg_music.setMusic();

//==============Khai báo hàm sự kiện bàn phím==================
function keyPressHandler(event) {
    const KEY_LEFT = 37;
    const KEY_RIGHT = 39;
    const KEY_UP = 38;
    const KEY_DOWN = 40;
    const KEY_CTRL = 17;
    switch (event.keyCode) {
        case KEY_LEFT:
            move("Left");
            break;
        case KEY_RIGHT:
            move("Right");
            break;
        case KEY_UP:
            move("Up");
            break;
        case KEY_DOWN:
            move("Down");
            break;
        case KEY_CTRL:
            speedBoost();
            break;
    }
}
function keyUp(event){
    if(event.keyCode === 17){
        myCar.speed = myCar.speed_boost/2;
    }
}
function speedBoost() { //Function boost speed của xe
    myCar.speedBoost();
}
//==================Khai báo thẻ canvas====================
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
//==================Khai báo Img của myCar=================
let carImgUp = new Image();
carImgUp.src = "img/carUp.png";
let carImgDown = new Image();
carImgDown.src = "img/carDown.png";
let carImgLeft = new Image();
carImgLeft.src = "img/carLeft.png";
let carImgRight = new Image();
carImgRight.src = "img/carRight.png";
//==================Khai báo Img của Object================
let rockImg = new Image();
rockImg.src="img/rock.png";
let coinImg = new Image();
coinImg.src="img/coin.png";
//=================Khai báo vị trí khởi tạo của myCar===========
const InitX = canvas.clientWidth/2;
const InitY = canvas.clientHeight -100;
let myCar = new MainCar(InitX,InitY,);
//==================Khai báo biến điểm, mảng object, lever==========
let score;
let objects = [];
let game_level = new Level(1,2,5,4);
//==================Khai báo hàm quy định việc tạo Object============
function createObjects() {
    for (let i=0;i<1;){
        let x = Math.random()*canvas.clientWidth;
        let y = Math.random()*canvas.clientHeight;
        if(Math.abs(x-myCar.x)>100||y-myCar.y>100){  //Thêm điều kiện để tạo Object không trùng với vị trí xe
            if(Math.random()>0.5){
                objects.push(new Object(x,y,true));
            }else {
                objects.push(new Object(x,y,false));
            }
            i++;
        }
    }
}
//=================Hàm giới hạn số lượng Objects tối đa tại 1 thời điểm===========
function deleteObjects() {
    if(objects.length>game_level.amountObj){
        objects.shift();
    }
}
function drawObjects() {
    for (j=0;j<objects.length;j++){
        objects[j].draw();
    }
}
function move(direct) { //Tái tạo chuyển động của vật thể
    if(score>=0){ //Khi game over, score = -1, khi đó vô hiệu hàm move, tránh bug
        clearCanvas();
        showScore();
        drawObjects();
        switch (direct) {
            case "Up":
                if(myCar.y>0){ //Giới hạn vật thể di chuyển chiều trên
                    myCar.moveUp();
                    myCar.draw("Up");
                    checkColision("Y");
                }else{
                    myCar.draw("Up");
                }
                break;
            case "Down":
                if(myCar.y<600){ //Giới hạn vật thể di chuyển chiều dưới
                    myCar.moveDown();
                    myCar.draw("Down");
                    checkColision("Y");
                }else {
                    myCar.draw("Down");
                }
                break;
            case "Left":
                if(myCar.x>0){
                    myCar.moveLeft();
                    myCar.draw("Left");
                    checkColision("X");
                }else {
                    myCar.draw("Left");
                }
                break;
            case "Right":
                if(myCar.x<1500){
                    myCar.moveRight();
                    myCar.draw("Right");
                    checkColision("X");
                }else {
                    myCar.draw("Right");
                }
                break;
        }
    }
}

function showScore() { //function show điểm
    ctx.font = "20px Verdana";
    var gradient = ctx.createLinearGradient(0, 0, 300, 180);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    ctx.fillStyle = gradient;
    ctx.fillText("SCORE: "+score, 1350, 30);
    ctx.fillText("LEVEL: "+game_level.level,1350,60);
}
//==================Hàm kiểm tra va chạm giữa đối tượng chính và các Object===================
function checkColision(direction) { //Kiểm tra chạm vào vật thể
    for(i=0;i<objects.length;i++){
        let checkX = Math.abs(myCar.x-objects[i].getCenterX());
        let checkY = Math.abs(myCar.y-objects[i].getCenterY());
        switch (direction) {
            case "X":
                if(checkY<75){
                    if(checkX<123){
                        if(objects[i].type){
                            score++;
                            setLevel(score);
                            get_point.play_sound();
                            objects.splice(i,1);
                            drawObjects();
                            showScore();
                        }else {
                            gameOver();
                            crash.play_sound();
                        }
                    }
                }
                break;
            case "Y":
                if(checkX<75){
                    if(checkY<123){
                        if(objects[i].type){
                            score++;
                            setLevel(score);
                            get_point.play_sound();
                            objects.splice(i,1);
                            drawObjects();
                            showScore();
                        }else {
                            gameOver();
                            crash.play_sound();
                        }
                    }
                }
                break;
        }
    }

}
let interval;
function setupInterval() {
    interval = setInterval(
        function (){
            createObjects();
            deleteObjects();
            drawObjects();
        },objects.respawn
    )
}
function gameStart() {
    if(objects.length<1){//Set điều kiện để khi game đã bắt đầu, vô hiệu hóa nút start,
        objects.respawn = game_level.re_spawn*1000;
        score = 0;
        showScore();
        start_sound.play_sound();
        myCar.draw("Up");
        setupInterval();
    }
}
//=================Hàm quản lý hệ thống level của game======================
function setLevel(score_variable) {
    switch (score_variable) {
        case 5:
            game_level.leverUp();
            interval = clearInterval();
            setupInterval();
            break;
        case 15:
            game_level.leverUp();
            interval = clearInterval();
            setupInterval();
            break;
        case 30:
            game_level.leverUp();
            interval = clearInterval();
            setupInterval();
            break;
        case 50:
            game_level.leverUp();
            interval = clearInterval();
            setupInterval();
            break;
        case 75:
            game_level.leverUp();
            interval = clearInterval();
            setupInterval();
            break;
        case 105:
            game_level.leverUp();
            interval = clearInterval();
            setupInterval();
            break;
        case 140:
            game_level.leverUp();
            interval = clearInterval();
            setupInterval();
            break;
    }
}
function gameOver() {
    clearCanvas();
    ctx.font = "60px Arial";
    ctx.fillText("GAME OVER",10,70);
    ctx.font = "30px Arial";
    ctx.fillText("YOUR SCORE: "+score,20,150);
    clearInterval(interval);
    score = -1;
}
function resetGame() {
    clearCanvas();
    score = -1;
    objects=[];
    game_level = new Level(1,2,5,4);
    myCar.x = InitX;
    myCar.y = InitY;
    clearInterval(interval);
}
//==============Hàm mute game sound================================
function muteGameSound() {
    start_sound.setMute();
    get_point.setMute();
    crash.setMute();
    if(get_point.mute){
        document.getElementById("game_sound").innerHTML = '<img height="50px" src="img/audio_no.png" alt="Sound">';
    }else {
        document.getElementById("game_sound").innerHTML = '<img height="50px" src="img/audio.png" alt="Sound">';
    }
}

function clearCanvas() {
    ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
}
//==================Khai báo hàm cho nút hiện thị hướng dẫn chơi==========================
function showTutorial() {
    var ruleGame = "Luật chơi:\n\Tránh tất cả đá ở trên đường và thu nhặt những đồng tiền vàng để tăng điểm"
    var tutorialText = "-Nhấn play để bắt đầu chơi.\n\ -Nhấn reset để chơi lại.\n\ -Giữ Control để tăng tốc độ.\n\ -Tùy chọn bật tắt sound và background music.";
    alert(ruleGame+"\n\ "+ tutorialText);
}