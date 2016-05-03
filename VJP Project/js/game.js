// Create the canvas
var canvas = document.getElementById("gameCanvas")
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Coin image
var coinReady = false;
var coinImage = new Image();
coinImage.onload = function () {
	coinReady = true;
};
coinImage.src = "images/coin.gif";

// Enemy image
var enemyReady = false;
var enemyImage = new Image();
enemyImage.onload = function () {
	enemyReady = true;
};
enemyImage.src = "images/monster.png";

// Audio files
var play = function() {
	var audio = document.getElementById("audio");
	audio.play();
}

var yeah = function() {
	var yeah = document.getElementById("ohyeah")
	yeah.play();
}


// Game state 
var hero = new Player(256);
var coin = {};
var coinsCaught = 0;
var enemyCount = 0;
var gameOver = false;
var enemies = new Array(new Enemy(hero));
var best = localStorage.getItem("top");
var onPause = false;

// New game setup
var newGame = function() {

for (i = 0; i < enemyCount; i++) { 
    	enemies[i] == null;
		}

enemies = [new Enemy(hero)];
enemyCount = 0;
gameOver = false;
keysDown= {};
cancelAnimationFrame(requestID);

if (coinsCaught >= best) {
	best = coinsCaught;
}

localStorage.setItem("top", best);

coinsCaught = 0;
hero.x = canvas.width / 2;
hero.y = canvas.height / 2;
pauseGame();
};

// Reset the game when the player catches a coin
var isFirst = true;
var reset = function () {
	if (isFirst) { 
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	isFirst = false;
	}

	// Throw the coin somewhere on the screen randomly
	coin.x = 32 + (Math.random() * (canvas.width - 64));
	coin.y = 32 + (Math.random() * (canvas.height - 64));
};


// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;

	// Prevent window from scrolling
	if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 32 || e.keyCode == 37 || e.keyCode == 39) {
          e.preventDefault();
        }

}, false);


addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];

	// Prevent window from scrolling
        if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 32 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 80) {
          e.preventDefault();
        }
}, false);



// Beastmode toggle
var modeOn = function() {
	document.getElementById("beastMode").style.display = "none";
	$("#normalMode").fadeIn("slow");
	yeah();
	hero.beastSpeed();

}
var modeOff = function() {
	document.getElementById("normalMode").style.display = "none";
	$("#beastMode").fadeIn("slow");
	hero.normalSpeed();

}

// Loadingscreen toggle
var playGame = function() {
	document.getElementById("loadScreen").style.display = "none";
	$("#gameCanvas").fadeIn("fast");
}

var pauseGame = function() {
	onPause = true;
}

// Update game objects
var update = function (modifier) {
	hero.move(modifier);

	// Check for collision with coin
	if (
		hero.x <= (coin.x + 32)
		&& coin.x <= (hero.x + 32)
		&& hero.y <= (coin.y + 32)
		&& coin.y <= (hero.y + 32)
	) {
		++coinsCaught;
		
		if (enemyCount <= 20) {
			enemies[enemyCount] = new Enemy(hero);
			++enemyCount;
			play();
		}

		reset();
	}

	enemySprite.updateSprite();

	for (i = 0; i < enemyCount; i++) { 
    	if (enemies[i].move(modifier)) {
    	newGame();
    	}
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		heroSprite.renderHero()
	}

	if (coinReady) {
		ctx.drawImage(coinImage, coin.x, coin.y);
	}

	if (enemyReady) {
		for (i = 0; i < enemyCount; i++) { 
    	enemySprite.renderEnemy(enemies[i].x, enemies[i].y);
		}

	if (onPause) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.beginPath();
		ctx.rect(0, 0, 512, 480);
		ctx.fillStyle = "rgba(50,50,50,0.3)";
		ctx.fill();

		// MENU BUTTON 1
		ctx.beginPath();
		ctx.rect(56,180,120,120);
		ctx.fillStyle = "rgb(56,50,50)";
		ctx.fill();

		// MENU BUTTON 2
		ctx.beginPath();
		ctx.rect(196,180,120,120);
		ctx.fillStyle = "rgb(250,250,250)";
		ctx.fill();

		// MENU BUTTON 3
		ctx.beginPath();
		ctx.rect(336,180,120,120);
		ctx.fillStyle = "rgb(184,182,182)";
		ctx.fill();

	}
}

	// Score
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Coins caught: " + coinsCaught, 32, 32);
	ctx.fillText("Best: " + best, 32, 64);
};



// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
