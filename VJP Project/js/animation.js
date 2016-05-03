// SPRITE

 // Create the canvas
var canvas = document.getElementById("gameCanvas")
//canvas.id = "gameCanvas";
var ctx = canvas.getContext("2d");
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


// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	requestID = requestAnimationFrame(main);
};
