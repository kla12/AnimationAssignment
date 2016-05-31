var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
function Carson(game, spritesheet) {
    this.animation = new Animation(spritesheet, 49, 48.2, 3, .1, 3, true, 4);
    this.speed = 400;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 450);
}

Carson.prototype = new Entity();
Carson.prototype.constructor = Carson;
dir = 0;

Carson.prototype.update = function () {
	switch (dir) {
		case 0: {
			this.x += this.game.clockTick * this.speed;
			break;
		}
		case 1: {
			this.x -= this.game.clockTick * this.speed;
		}
	}
	size = (Math.random() * 3) + 4;
	if (this.x < -200) {
		this.animation = new Animation(AM.getAsset("./img/carsonright.png"), 49, 48.2, 3, .1, 3, true, size);
		dir = 0;
	}
    if (this.x > 1100) {
		//this.spritesheet = AM.getAsset("./img/carsonleft.png");
		this.animation = new Animation(AM.getAsset("./img/carsonleft.png"), 49, 48.2, 3, .1, 3, true, size);
		dir = 1;
	}
    Entity.prototype.update.call(this);
}

Carson.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

AM.queueDownload("./img/opRoom.png");
AM.queueDownload("./img/carsonright.png");
AM.queueDownload("./img/carsonleft.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/opRoom.png")));
	gameEngine.addEntity(new Carson(gameEngine, AM.getAsset("./img/carsonright.png")));
    console.log("All Done!");
});
