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
var enemiesDeleted = false;




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

if (coinsCaught >= best && !enemiesDeleted) {
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


// animation.js - Sprite content
var lastTime = 0;							
	
	function sprite (options) {
	
		var that = {},
			frameIndex = 0,
			tickCount = 0,
			ticksPerFrame = options.ticksPerFrame || 0,
			numberOfFrames = options.numberOfFrames || 1;
		
		that.context = options.context;
		that.width = options.width;
		that.height = options.height;
		that.image = options.image;
		
		that.updateSprite = function () {

            tickCount += 1;

            if (tickCount > ticksPerFrame) {

				tickCount = 0;
				
                // If the current frame index is in range
                if (frameIndex < numberOfFrames - 1) {	
                    // Go to the next frame
                    frameIndex += 1;
                } else {
                    frameIndex = 0;
                }
            }
        };
		
		that.renderHero = function () {
		
		  // Clear the canvas
		  ctx.clearRect(0, 0, canvas.width, canvas.height);
		  
		  // Draw the animation
		  ctx.drawImage(
		    that.image,
		    frameIndex * that.width / numberOfFrames,
		    0,
		    that.width / numberOfFrames,
		    that.height,
		    hero.x,
		    hero.y,
		    that.width / numberOfFrames,
		    that.height);
		};


		that.renderEnemy = function (x,y) {
		  
		  // Draw the animation
		  ctx.drawImage(
		    that.image,
		    frameIndex * that.width / numberOfFrames,
		    0,
		    that.width / numberOfFrames,
		    that.height,
		    x,
		    y,
		    that.width / numberOfFrames,
		    that.height);
		};
		
		return that;
	}
	
	// Create sprite sheets
	var heroSpriteImage = new Image();
	var enemySpriteImage = new Image();	
	
	// Create sprites
	var heroSprite = sprite({
		context: ctx,
		width: 60,
		height: 32,
		image: heroSpriteImage,
		numberOfFrames: 2,
		ticksPerFrame: 20
	});

	var enemySprite = sprite({
		context: ctx,
		width: 60,
		height: 32,
		image: enemySpriteImage,
		numberOfFrames: 2,
		ticksPerFrame: 20
	});
	
	// Load sprite sheet
	heroSpriteImage.addEventListener("load", main);
	heroSpriteImage.src = "images/hero-sprite.png";
	enemySpriteImage.addEventListener("load", main);
	enemySpriteImage.src = "images/enemy-sprite.png";

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
        if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 32 || e.keyCode == 37 || e.keyCode == 39) {
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

/**var pauseGame = function() {
	document.getElementById("gameCanvas").style.display = "none";
	$("#loadScreen").fadeIn("fast"); 
} */
var onPause = false;
var pauseGame = function() {
	onPause = true;
}

// Delete enemies on click 
canvas.addEventListener("mousedown", tap);

function getElementPosition (element) {
	
       var parentOffset,
       	   pos = {
               x: element.offsetLeft,
               y: element.offsetTop 
           };
           
       if (element.offsetParent) {
           parentOffset = getElementPosition(element.offsetParent);
           pos.x += parentOffset.x;
           pos.y += parentOffset.y;
       }
       return pos;
}
	
function tap (e) {
	
		var i,
			loc = {},
			pos = getElementPosition(canvas),
			tapX = e.targetTouches ? e.targetTouches[0].pageX : e.pageX,
			tapY = e.targetTouches ? e.targetTouches[0].pageY : e.pageY,
			canvasScaleRatio = canvas.width / canvas.offsetWidth;

		loc.x = (tapX - pos.x) * canvasScaleRatio;
		loc.y = (tapY - pos.y) * canvasScaleRatio;
			
		for (i = 0; i < enemies.length; i += 1) {
			if (
				enemies[i].x <= (loc.x + 26)
				&& loc.x <= (enemies[i].x + 26)
				&& enemies[i].y <= (loc.y + 26)
				&& loc.y <= (enemies[i].y + 26)
			) {
				enemies[i] = null;
				enemies.splice(i, 1);
				enemyCount -= 1;
				enemiesDeleted = true;
			}
		}				
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
		ctx.beginPath();
		ctx.rect(0, 0, 512, 480);
		ctx.fillStyle = "rgba(0,0,0,0.3)";
		ctx.fill();
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.font = "72px Helvetica";
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		ctx.fillText("GAME OVER!", 256, 240);
		ctx.fillText("Coins caught: " + coinsCaught, 32, 32);
		ctx.fillText("Best: " + best, 32, 64);
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