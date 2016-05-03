function Enemy(player) {
	var atRight = false;
	var atLeft = false;
	var atTop = false;
	var atBottom = false;
	var heading = Math.random();
	
	this.speed = ((Math.random() + 1) * 75)
	this.x = 32 + (Math.random() * (canvas.width - 64));
	this.y = 32 + (Math.random() * (canvas.height - 64));
	this.move = function(modifier) {
	
	if (
		player.x <= (this.x + 26)
		&& this.x <= (player.x + 26)
		&& player.y <= (this.y + 26)
		&& this.y <= (player.y + 26)
	) {
		return true;
	}

	if (heading >= 0.5) {	
		if(atRight) {
		this.x -= (this.speed) * modifier;
		} else {
		this.x += (this.speed) * modifier;
		}
		
		if(this.x <= 0) {
			atLeft = true;
			atRight = false;
		}
		if(this.x >= 482) {
			atLeft = false;
			atRight = true;
		}

	} else {
		if(atBottom) {
		this.y -= (this.speed) * modifier;
		} else {
		this.y += (this.speed) * modifier;
		}
		
		if(this.y <= 0) {
			atTop = true;
			atBottom = false;
		}
		if(this.y >= 452) {
			atTop = false;
			atBottom = true;
		}
	}
};

};