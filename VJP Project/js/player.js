function Player(speed) {
    this.speed = speed;

    this.teslaSpeed = function() {
        this.speed = 400;
    };

    this.normalSpeed = function() {
        this.speed = 256;
    };

    this.move = function(modifier) {

        if (onPause && !(80 in keysDown)) {
            return;
        }

        if (38 in keysDown) { // Player holding up
            hero.y -= hero.speed * modifier;
            heroSprite.updateSprite();
            if (hero.y <= 0) {
                hero.y = 0;

            }
        }
        if (40 in keysDown) { // Player holding down
            hero.y += hero.speed * modifier;
            heroSprite.updateSprite();
            if (hero.y >= 451) {
                hero.y = 451;
            }
        }
        if (37 in keysDown) { // Player holding left
            movDir = "left";
            hero.x -= hero.speed * modifier;
            heroSprite.updateSprite();
            if (hero.x <= 0) {
                hero.x = 0;
            }
        }
        if (39 in keysDown) { // Player holding right
            movDir = "right";
            hero.x += hero.speed * modifier;
            heroSprite.updateSprite();
            if (hero.x >= 481) {
                hero.x = 481;
            }
        }
    };
}