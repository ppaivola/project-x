
    // Create the canvas
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 480;

    // Background image
    var bgReady = false;
    var bgImage = new Image();
    bgImage.onload = function() {
        bgReady = true;
    };
    bgImage.src = "images/background.png";

    // Hero image
    var heroReady = false;
    var heroImage = new Image();
    heroImage.onload = function() {
        heroReady = true;
    };
    heroImage.src = "images/hero.png";

    // Coin image
    var coinReady = false;
    var coinImage = new Image();
    coinImage.onload = function() {
        coinReady = true;
    };
    coinImage.src = "images/coin.gif";

    // Enemy image
    var enemyReady = false;
    var enemyImage = new Image();
    enemyImage.onload = function() {
        enemyReady = true;
    };
    enemyImage.src = "images/monster.png";

    // Play Icon
    var playReady = false;
    var playImage = new Image();
    playImage.onload = function() {
        playReady = true;
    };
    playImage.src = "images/playicon.png";

    // Newgame Icon
    var ngReady = false;
    var ngImage = new Image();
    ngImage.onload = function() {
        ngReady = true;
    };
    ngImage.src = "images/newgame.png";

    // Mute Icon
    var muteReady = false;
    var muteImage = new Image();
    muteImage.onload = function() {
        muteReady = true;
    };
    muteImage.src = "images/muteicon.png";

    // Audio files
    var audio = document.getElementById("audio");
    var yeah = document.getElementById("ohyeah");
    var gameOverAudio = document.getElementById("gameover");

    function muteAll() {
        audio.muted = !audio.muted;
        yeah.muted = !yeah.muted;
        gameOverAudio.muted = !gameOverAudio.muted;
    }

    // Game state 
    var hero = new Player(256);
    var coin = {};
    var coinsCaught = 0;
    var enemyCount = 0;
    var gameEnded = false;
    var enemies = new Array(new Enemy(hero));
    var best = localStorage.getItem("top");
    var onPause = false;

    var selectedMenuButton = 0;
    var gameStarted = false;
    var beastMode = false;
    var beastUsed = false;

    function gameover() {
        ctx.font = "30px Arial";
        ctx.fillText("Game Over.", canvas.width / 2 - 70, canvas.height / 2 - 125);
        ctx.fillText("You failed to collect 100 coins.", canvas.width / 2 - 200, canvas.height / 2 + 50);
        ctx.fillText("Better luck next time!", canvas.width / 2 - 150, canvas.height / 2 + 100);
        gameEnded = true;
        gameOverAudio.play();

        // Display game over for 3 seconds.
        setTimeout(function() {
            console.log("New game");
            newGame();
            // Restart animation routine
            var w = window;
            requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
            var then = Date.now();
            reset();
            main();
        }, 3000);
    }

    // New game setup
    function newGame() {
        for (i = 0; i < enemyCount; i++) {
            enemies[i] = null;
        }
        enemies = [new Enemy(hero)];
        enemyCount = 0;
        gameEnded = false;
        beastMode = false;
        beastUsed = false;
        selectedMenuButton = 0;
        gameStarted = false;

        keysDown = {};
        cancelAnimationFrame(requestID);

        if (coinsCaught >= best) {
            best = coinsCaught;
        }


        localStorage.setItem("top", best);

        coinsCaught = 0;
        hero.x = canvas.width / 2;
        hero.y = canvas.height / 2;
        pauseGame();
    }

    // Reset the game when the player catches a coin
    var isFirst = true;

    function reset() {
        if (isFirst) {
            hero.x = canvas.width / 2;
            hero.y = canvas.height / 2;

            isFirst = false;
        }

        // Throw the coin somewhere on the screen randomly
        coin.x = 32 + (Math.random() * (canvas.width - 64));
        coin.y = 32 + (Math.random() * (canvas.height - 64));
    }


    // Handle keyboard controls
    var keysDown = {};

    addEventListener("keydown", function(e) {
        keysDown[e.keyCode] = true;
        // Prevent window from scrolling
        if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 32 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 80) {
            e.preventDefault();
        }
        if (80 in keysDown) { // "P" - button pressed
            pauseGame();
            console.log("Pause pressed");
        }

        if (e.keyCode === 32) { // space
            console.log("Activate beast mode");
            modeOn();
        }

        if (onPause && e.keyCode !== 80 && !gameEnded) {
            if (e.keyCode === 37) { // left
                if (selectedMenuButton === 0) selectedMenuButton = 2;
                else selectedMenuButton += -1;
            }
            if (e.keyCode === 39) { // right
                selectedMenuButton += 1;
                selectedMenuButton = selectedMenuButton % 3;
            }
            if (e.keyCode === 13) { // enter
                menuButtonAction(selectedMenuButton);
            }
            console.log(selectedMenuButton);
        } else if (13 in keysDown && !gameEnded) {
            pauseGame();
            console.log("Pause pressed");
        }

        // Pressing any key will start the game
        if (!gameStarted) playGame();
    }, false);

    function menuButtonAction(selectedMenuButton) {
        switch (selectedMenuButton) {
            case 0:
                console.log("Resume");
                onPause = false;
                break;
            case 1:
                muteAll();
                console.log("Mute: " + audio.muted);
                break;
            case 2:
                console.log("Restart");
                location.reload();
                break;
            default:
                break;
        }
    }

    addEventListener("keyup", function(e) {
        delete keysDown[e.keyCode];

        // Prevent window from scrolling
        if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 32 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 80) {
            e.preventDefault();
        }
    }, false);



    // Beastmode toggle
    function modeOn() {
        if (beastUsed) return;
        document.getElementById("beastMode").style.display = "none";
        $("#normalMode").fadeIn("slow");
        yeah.play();
        hero.beastSpeed();
        beastMode = beastUsed = true;
        setTimeout(modeOff, 10E3); // Beast mode timeout
    }

    function modeOff() {
        //document.getElementById("normalMode").style.display = "none";
        //$("#beastMode").fadeIn("slow");
        hero.normalSpeed();
        beastMode = false;
    }

    function reTesla() {
        document.getElementById("normalMode").style.display = "none";
        $("#beastMode").fadeIn("slow");
    }

    // Loadingscreen toggle
    function playGame() {
        document.getElementById("loadScreen").style.display = "none";
        $("#gameCanvas").fadeIn("fast");
        gameStarted = true;
    }

    function pauseGame() {
        onPause = !onPause;
    }

    // Update game objects
    function update(modifier) {
        if (onPause) return;
        if (gameEnded) return;

        hero.move(modifier);

        // Check for collision with coin
        if (
            hero.x <= (coin.x + 32) &&
            coin.x <= (hero.x + 32) &&
            hero.y <= (coin.y + 32) &&
            coin.y <= (hero.y + 32)
        ) {
            ++coinsCaught;

            // Grant tesla bike mode in every 10 coins
            if (coinsCaught % 10 === 0) {
                beastUsed = false;
                reTesla();
            }

            if (enemyCount <= 20) {
                enemies[enemyCount] = new Enemy(hero);
                ++enemyCount;
                audio.play();
            }

            reset();
        }

        enemySprite.updateSprite();

        // Check for enemy collision
        for (i = 0; i < enemyCount; i++) {
            if (enemies[i].move(modifier)) {
                // Ignore collision in beast mode
                if (!beastMode) gameover();
            }
        }
    }

    function highlight(selectedMenuButton, startX, buttonSpacing, sideLength) {
        // Highlight
        var buttonX = startX + selectedMenuButton * buttonSpacing;
        var buttonY = 180;

        ctx.beginPath();
        ctx.moveTo(buttonX, buttonY);
        ctx.lineTo(buttonX, buttonY + sideLength);
        ctx.lineTo(buttonX + sideLength, buttonY + sideLength);
        ctx.lineTo(buttonX + sideLength, buttonY);
        ctx.lineTo(buttonX, buttonY);
        ctx.lineWidth = 10;
        ctx.strokeStyle = "yellow";
        ctx.stroke();
    }

    // Draw everything
    function render() {
        if (gameEnded) return;
        if (onPause) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.beginPath();
            ctx.rect(0, 0, 512, 480);
            ctx.fillStyle = "rgba(50,50,50,0.3)";
            ctx.fill();

            // MENU BUTTON 1
            ctx.beginPath();
            ctx.rect(56, 180, 120, 120);
            ctx.fillStyle = "rgb(233,5,5)";
            ctx.fill();

            ctx.drawImage(playImage, 76, 200);

            // MENU BUTTON 2
            ctx.beginPath();
            ctx.rect(196, 180, 120, 120);
            ctx.fillStyle = "rgb(250,250,250)";
            ctx.fill();

            ctx.drawImage(muteImage, 216, 200);


            // MENU BUTTON 3
            ctx.beginPath();
            ctx.rect(336, 180, 120, 120);
            ctx.fillStyle = "rgb(184,182,182)";
            ctx.fill();

            ctx.drawImage(ngImage, 356, 205);

            highlight(selectedMenuButton, 56, 196 - 56, 120);
            return;

        }

        if (bgReady) {
            ctx.drawImage(bgImage, 0, 0);
        }

        if (heroReady) {
            heroSprite.renderHero();
        }

        if (coinReady) {
            ctx.drawImage(coinImage, coin.x, coin.y);
        }

        if (enemyReady) {
            for (i = 0; i < enemyCount; i++) {
                enemySprite.renderEnemy(enemies[i].x, enemies[i].y);
            }

        }

        if (beastMode) {
            // Indicate tesla bike mode
            ctx.fillStyle = "rgb(255, 0, 0)";
            ctx.font = "24px Helvetica";
            ctx.textAlign = "Center";
            ctx.textBaseline = "top";
            ctx.fillText("TESLA BIKE MODE", canvas.width / 2 - 100, canvas.height / 2 - 125);
        }

        // Score
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Coins caught: " + coinsCaught, 32, 32);
        ctx.fillText("Best: " + best, 32, 64);
    }



    // Cross-browser support for requestAnimationFrame
    var w = window;
    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    // Let's play this game!
    var then = Date.now();
    reset();
    main();
