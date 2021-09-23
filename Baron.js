var ctx, empty, baron, world, control, points;


// ACTORS

var Actor = EXTENDS(JSRoot, {
	x: 0, y: 0,
	image: null,
	time: 0,
	INIT: function(x, y, kind) {
		this.x = x;
		this.y = y;
		this.image = GameImage.get(kind, "").image;
		this.time = 0;
		this.show();
	},
	show: function() {
		world[this.x][this.y] = this;
		ctx.drawImage(this.image, this.x * ACTOR_PIXELS_X, this.y * ACTOR_PIXELS_Y);
	},
	hide: function() {
		world[this.x][this.y] = empty;
		ctx.drawImage(empty.image, this.x * ACTOR_PIXELS_X, this.y * ACTOR_PIXELS_Y);
	},
	move: function(dx, dy) {
		this.hide();
		this.x += dx;
		this.y += dy;
		this.show();
	},
	animation: function() {
	},
    canPass: function(){
        return false;
    },
    smash: function(){
        return false;
    },
    fly: function(){
        return false;
    },
    drop: function(){
        return false;
    },
    bite: function(){
      return false;  
    },
    gather: function(){
      return false;  
    },
    empurrar: function(dx,dy){
        return false;
    },
	hit: function(){
		return false;
	},
	unBlink: function() {
			ctx.drawImage(this.image, this.x * ACTOR_PIXELS_X, this.y * ACTOR_PIXELS_Y);
		},
	Blink: function() {
		ctx.drawImage(empty.image, this.x * ACTOR_PIXELS_X, this.y * ACTOR_PIXELS_Y);
	},
	alive:true,
	timer:0,
});

var Inerte = EXTENDS(Actor, {
	INIT: function(x,y,kind) {
		this.SUPER(Actor.INIT,x,y,kind);
	},
})

var Empty = EXTENDS(Inerte, {
	INIT: function() {
		this.SUPER(Actor.INIT, -1, -1, "Empty", "");
	},
	show: function() {},
	hide: function() {},
	canPass: function(){return true},
});

var Block = EXTENDS(Inerte, {
	INIT: function(x, y) {
		this.SUPER(Actor.INIT, x, y, "Block");
	},
	
})

var Sun = EXTENDS(Inerte, {
	INIT: function(x, y) {
		this.SUPER(Actor.INIT, x, y, "Sun");
	},
	drop: function(){
		alert("PASSOU O NIVEL");
		nextLevel();
	},
})

var Movel = EXTENDS ( Actor, {
	INIT: function(x,y,kind) {
		this.SUPER(Actor.INIT,x,y,kind);
	},
	empurrar: function(dx,dy){
	var neigbhour=world[this.x+dx][this.y+dy];
		if(neigbhour.canPass()){
			this.move(dx,dy);
			return true;
		}
		else{
			this.alive=false;
			return false;
		}
	},	
})

/*var Destrutivel = EXTENDS (Movel ,
	INIT: function(x,y,kind) {
		this.SUPER(Actor.INIT,x,y,kind);
	},
})*/

var Jerrycan = EXTENDS(Movel, {
	INIT: function(x, y) {
		this.SUPER(Actor.INIT, x, y, "Jerrycan");
	},
	animation: function() {
		var neighbour = world [this.x][this.y+1];
		if( (neighbour.canPass() || neighbour.drop())  && this.time % 5 == 0 ) {
			this.move(0,1);
		}
	},
	empurrar: function(dx,dy){
	var neigbhour=world[this.x+dx][this.y+dy];
		if(neigbhour.canPass()){
			this.move(dx,dy);
			return true;
		}
		else{return false;}
	},
})
var Weight = EXTENDS(Movel, {
	INIT: function(x, y) {
		this.SUPER(Actor.INIT, x, y, "Weight");
	},
	animation: function() {
		if(this.alive){
			var neighbour = world [this.x][this.y+1];
			if( (neighbour.canPass() || neighbour.smash()) && this.time%2==0)  {
				this.move(0,1);
			}
		}
		else if(this.timer<10){
			if(this.time%2==0) this.Blink();
			else this.unBlink();
			this.timer++;
		}
		else {
			this.hide();
		}
	},

})
var Ballon = EXTENDS(Movel, {
	INIT: function(x, y) {
		this.SUPER(Actor.INIT, x, y, "Ballon");
	},	
	animation: function() {
		if(this.alive){
			var neighbour = world [this.x][this.y-1];
			if( (neighbour.canPass() || neighbour.fly() )&& this.time % 10 == 0 ) {
				this.move(0,-1);	
			}	
		}
		else if(this.timer<10){
			if(this.time%2==0) this.Blink();
			else this.unBlink();
			this.timer++;
		}
		else {
			this.hide();
		}
	},
})

	/*
		Arma
	*/

var Arma = EXTENDS(Actor, {
	INIT: function(x,y,kind) {
		this.SUPER(Actor.INIT,x,y,kind);	
	},
	gather: function (){
		return true;
	},
	moving: false,
})
var Ball = EXTENDS(Arma, {
	dx:0,
	dy:0,
	INIT: function(x, y) {
		this.SUPER(Arma.INIT, x, y, "Ball");
	},
	animation: function(){
		if(this.moving){    
			var neighbour = world [this.x+this.dx][this.y+this.dy];
			if( neighbour.canPass() ){
				this.move(this.dx,this.dy);	
			}
			else {
				if(neighbour.hit()){
				}
				this.moving=false;
			}
		}   
	},
	shoot: function(x,y,dx,dy){
		this.x=x;
		this.y=y;
		this.dx=dx;
		this.dy=dy;
		this.moving=true;
},
})

/*
	MONSTROS
*/

var Monstro= EXTENDS(Actor, {
	INIT: function(x,y,kind) {
		this.SUPER(Actor.INIT,x,y,kind);
		
	},
    smash: function(){
        this.alive=false;
        return false;
     },
    fly:function(){
        this.alive=false;
        return false;
    },
    drop:function(){
        this.alive=false;
        return false;
    },
	hit:function(){
		this.alive=false;
		return false;
	},
})

var Mammoth = EXTENDS(Monstro, {
	INIT: function(x, y) {
		this.SUPER(Monstro.INIT, x, y, "Mammoth");
		
	},
	animation: function() {
		if(this.alive){
			var dx=0; 
			var dy=0;
				if(baron.x>this.x){
					dx=1;
				}else if(baron.x<this.x) {
					dx=-1;
				}
				if(baron.y>this.y){
					dy=1;
				}else if(baron.y<this.y) {
					dy=-1;
				}
			var neighbour = world [this.x+dx][this.y+dy];
			console.log(this.calculateSpeedLevel())
			if( this.time % this.calculateSpeedLevel() == 0 ) {
				if( neighbour.canPass()){
					this.move(dx,dy);
				}
				else {
					if( (dx==0 || dy == 0) && (neighbour.bite()) ) {
						this.move(dx,dy);
					}
				}
			}
		} else if(this.timer<10){
			if(this.time%2==0) this.Blink();
			else this.unBlink();
			this.timer++;
		} else {
			this.hide();
		}
	},
	calculateSpeedLevel: function() {
		return (MAX_SPEED - MAMMOTH_SPEED) + 1;
	}
})

/*
	HEROI
*/

var Heroi= EXTENDS(Actor, {
	balls:[],
	dx :0,
	dy:0,
	INIT: function(x,y,kind) {
		this.SUPER(Actor.INIT,x,y,kind);	
	},
    smash: function(){
        this.alive=false;
        return false;
     },
    drop:function(){
    	this.alive=false;
        return false;
    },
	bite:function(){
		this.alive= false;
		return false;
    },
	hit:function(){
		this.alive= false;
        return false;
	},
	})
var Baron = EXTENDS(Heroi, {
	INIT: function(x, y) {
		this.SUPER(Heroi.INIT, x, y, "Baron");
		this.balls = [];
		this.dx = 0;
		this.dy = 0;
		
	},
	animation: function(){
		if(this.alive){
			var d = control.getKey();
			if( d == null ) return;
			if(d=="Z" && this.balls.length>0){
				var neighbour = world[this.x + this.dx][this.y + this.dy];
				if(neighbour.canPass()){
					neighbour=this.balls.pop();
					neighbour.shoot(this.x+this.dx,this.y+this.dy,this.dx,this.dy);
					neighbour.show();
				}
				return;
			}
			this.dx = d[0]; this.dy = d[1];
			var neighbour = world[this.x + this.dx][this.y + this.dy];
			if( neighbour.canPass() || neighbour.empurrar(this.dx, this.dy)){
				this.move(this.dx, this.dy);
			}
			else if(neighbour.gather() && this.balls.length<10){
				this.balls.push(neighbour);
				this.move(this.dx, this.dy);
			}
		}
		else if(this.timer<10){
			if(this.time%2==0) this.Blink();
			else this.unBlink();
			this.timer++;
		}
		else {
			alert("o monstro matou o");
			this.hide();
			--control.lifes;
			
			alert(control.lifes);
			createCanvas();
			if(control.lifes == 0) {
				alert("perdeu");
				control.lifes = 3;					
				b2();
			}else{
			b1();
			}
		}
	},
		
	})


// GAME CONTROL1\

var GameControl = EXTENDS(JSRoot, {
	key: 0,
	level: 1,
	time: 0,
	ctx2: 0,
	ctx3: 0,
	ctx4:0,
	level: 1,
    lifes: BARON_LIVES,
	score: 0,
	
	INIT: function() {
		ctx = document.getElementById("canvas1").getContext("2d");
		empty = NEW(Empty);	// only one empty actor needed
		world = this.createWorld();
		this.ctx2 = document.getElementById("canvas2").getContext("2d");
		this.ctx3 = document.getElementById("canvas3").getContext("2d");
		this.ctx4 = document.getElementById("canvas4").getContext("2d");
		this.loadLevel(1);
		this.setupEvents();
		control = this;
		level = 1;
		lifes = BARON_LIVES;
		score=0;
		
		
	},
	createWorld: function () { // stored by columns
		var matrix = new Array(WORLD_WIDTH);
		for( var x = 0 ; x < WORLD_WIDTH ; x++ ) {
			var a = new Array(WORLD_HEIGHT);
			for( var y = 0 ; y < WORLD_HEIGHT ; y++ )
				a[y] = empty;
			matrix[x] = a;
		}
		return matrix;
	},
	loadLevel: function(level) {
		if( level < 1 || level > MAPS.length )
			fatalError("Invalid level " + level)
		var map = MAPS[level-1];  // -1 because levels start at 1
		for(var x=0 ; x < WORLD_WIDTH ; x++)
			for(var y=0 ; y < WORLD_HEIGHT ; y++) {
				world[x][y].hide();
				var code = map[y][x];  // x/y reversed because map stored by lines
				var gi = GameImage.getByCode(code);
				if( gi ) {
					var a = NEW(globalByName(gi.kind), x, y);
					if( gi.kind == "Baron" )
						baron = a;
				}
			}
			
	},
	getKey:  function() {
		var k = this.key;
		this.key = 0;
		switch( k ) {
			case 37: case 79: case 74: return [-1, 0]; //  LEFT, O, J
			case 38: case 81: case 73: return [0, -1]; //    UP, Q, I
			case 39: case 80: case 76: return [1, 0];  // RIGHT, P, L
			case 40: case 65: case 75: return [0, 1];  //  DOWN, A, K
			case 0: return null;
			default: {
				return String.fromCharCode(k);
			}
		// http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
		};	
	},
	setupEvents: function() {
		addEventListener("keydown", this.keyDownEvent, false);
		addEventListener("keyup", this.keyUpEvent, false);
		
		setInterval(this.animationEvent, 1000 / ANIMATION_EVENTS_PER_SECOND);
	},
	animationEvent: function() {
		control.time++;
		createCanvas();
		if((control.time)/10 == 120) {
			--lifes;
		}
		for(var x=0 ; x < WORLD_WIDTH ; x++)
			for(var y=0 ; y < WORLD_HEIGHT ; y++) {
				var a = world[x][y];
				if( a.time < control.time ) {
					a.time = control.time;
					a.animation();
				}
			}
	},
	keyDownEvent: function(k) { control.key = k.keyCode; },
	keyUpEvent: function(k) { },
});


// HTML FORM

function onLoad() {
  // load images an then run the game
	GameImage.loadImages(function() {NEW(GameControl);});

}


function b1() {
	control.loadLevel(control.level); }
function nextLevel() {
	if((control.time/10) < 120) {control.score += 120 - (control.time/10);}
	control.time = 0;
	if(level<7)control.loadLevel(++control.level); 
	else {
		control.score += control.lifes * 200;
		alert("GANHOU")};
}
function b2() {
	control.time = 0;
	control.level = 1;
	control.lifes=BARON_LIVES;
	control.score=0;
	control.loadLevel(control.level);}
function createCanvas(){
		badjoras = control.lifes;
		for(var x = 0; x  < badjoras; x++ ) {
			(control.ctx2).drawImage(GameImage.get("Baron", "").image,x*ACTOR_PIXELS_X,1*ACTOR_PIXELS_Y);
		}
		x = control.lifes;
		for(var y = 2; y > x-1; y--) {
			(control.ctx2).drawImage(GameImage.get("Empty", "").image,y*ACTOR_PIXELS_X,1*ACTOR_PIXELS_Y);
		}
		(control.ctx3).font = "30px Arial";
		(control.ctx3).clearRect(0,0,80,30);
		(control.ctx3).fillText(((control.time)/10).toString(),0,30);
		(control.ctx4).font = "30px Arial";
		(control.ctx4).clearRect(0,0,80,30);
		(control.ctx4).fillText((control.score).toString(),0,30);
}
//{form1}.{time2}.value = control.time;




    
    