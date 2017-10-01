function collide(x, y, object){
    if(x > object.x && x < object.x + object.w && y > object.y && y < object.y + object.h ){
        return true;
    } else {
        return false;
    }
}

var app = playground({

    width : 800,
    height: 800,
    preferedAudioFormat: "mp3",

    create: function(){
        this.American = {
            up: 'w',
            down: 's',
            left: 'a',
            right: 'd',
        }

        this.French = {
            up: 'z',
            down: 's',
            left: 'q',
            right: 'd',
        }

        this.controls = this.French;

        this.fantom = {
            x: 400,
            y: 200,
            ys: 0,
            xs: 0,
            w: 100,
            h: 100,
            image: 'ghostieleft'
        }

        this.iB = {
            x: 0,
            y: 0,
            w: 100,
            h: 100,
            startx: 0,
            starty: 0,
            image: 'iB'
        }

        this.inventory = [{}, {}, {}, {}];

        this.sB = {
            x: 700,
            y: 0,
            w: 100,
            h: 100,
            starty: 0,
            image: 'setings'
        }

        this.pB = {
            x: 400 - 50,
            y: 600,
            w: 100,
            h: 50,
        }

        this.intro = {
            x: 100,
            y: 100,
            w: 600,
            h: 600,
        }

        this.introDone = false;

        this.settings = [{}, {}];

        this.settings[0] = {
            image: 'soundOff',
            action: () => {
                if(app.Music.volume != 0.0){
                    app.Music.volume = 0.0;
                    app.settings[0].image = 'soundOff';
                } else {
                    app.Music.volume = 1.0;
                    app.settings[0].image = 'soundOn';
                }
            }
        }

        this.settings[1] = {
            image: 'Fr',
            action: () => {
                if(app.controls == app.French){
                    app.controls = app.American;
                    app.settings[1].image = 'Am'
                } else {
                    app.controls = app.French;
                    app.settings[1].image = 'Fr'
                }
            }
        }

        //items
        this.desk = {
            x: 250,
            y: 300,
            w: 100,
            h: 100,
            image: 'table',
        }

        this.ui = [this.sB, this.iB];

        this.objects = [this.desk];

        this.loadImages('iB', 'setings', 'g', 'g2',
            'ghostieback',
            'ghostieleft',
            'ghostieright',
            'ghostiefront',
            'pB',
            'soundOn',
            'soundOff',
            'Am',
            'Fr'
        );

        //music load
        this.Music = new Audio;
        this.Music.loop = true;
        this.Music.src = 'sounds/tra.mp3';
        this.Music.volume = 0.0;
        this.Music.play();
        this.Music.onended = () =>{
            this.Music.play();
        }


    },

    //inputs
    keydown: function (e) {
        //console.log(e.key);
        if(this.introDone){
            switch (e.key) {
            case this.controls.left:
                this.fantom.ys = 0;
                this.fantom.xs = -2;
                this.fantom.image = 'ghostieright';
                break;

            case this.controls.right:
                this.fantom.ys = 0;
                this.fantom.xs = 2;
                this.fantom.image = 'ghostieleft';
                break;

            case this.controls.up:
                this.fantom.xs = 0;
                this.fantom.ys = -2;
                this.fantom.image = 'ghostieback';
                break;

            case this.controls.down:
                this.fantom.xs = 0;
                this.fantom.ys = 2;
                this.fantom.image = 'ghostiefront';
                break;

            case 'space':
                this.fantom.xs = 0;
                this.fantom.ys = 0;
                break;
        }
        }

    },

    mousedown: function(e) {
        //inventory button
        if(collide(e.x, e.y, this.iB)){

            if(this.iB.y != this.iB.starty){
                this.tween(this.iB)
                    .to({y: this.iB.starty}, 0.5)
            } else {
                var modif = this.inventory.length * 100;
                this.tween(this.iB)
                    .to({y: this.iB.starty + modif}, 0.5);
            }
        }

        //settings button
        if(collide(e.x, e.y, this.sB)){

            if(this.sB.y != this.sB.starty){
                this.tween(this.sB)
                    .to({y: this.sB.starty}, 0.5)
            } else {
                var modif = this.settings.length * 100;
                this.tween(this.sB)
                    .to({y: this.sB.starty + modif}, 0.5)
            }
        }

        //set settings
        for(var i = 0; i < this.settings.length; i++){
            if(collide(e.x, e.y, this.settings[i])){
                this.settings[i].action();
            }
        }

        if(collide(e.x, e.y, this.pB)){
            this.introDone = true;
            this.tween(this.intro)
                .to({y: -800}, 0.5);
            this.tween(this.pB)
                .to({y: -800}, 0.5);
        }
    },

    mousemove: function (e) {
        for(var i = 0; i < this.ui.length; i++){
            if( collide(e.x, e.y, this.ui[i] ) ){
                this.ui[i].hover = true;
            } else {
                this.ui[i].hover = false;
            }
        }
    },

    //fonctionality
    drawBox: function(object) {
        this.layer.drawImage(this.images[object.image], object.x, object.y);
        if(object.hover){
            this.layer.strokeLine(object.x + 15, object.y + object.h, object.x + object.w - 15, object.y + object.h);
        }
    },

    fantomCollide: function(object) {
        var f = this.fantom;
        var o = object;
        if(f.x > o.x + o.w || f.x + f.w < o.x || f.y + f.h < o.y || f.y > o.y + o.h ){
            return false;
        } else {
            return true;
        }
    },

    drawUi: function(){
        for(var i = 0; i < this.ui.length; i++){
            this.drawBox(this.ui[i]);
        }
    },

    drawInventoryContent(){
        for(var i = 0; i < this.inventory.length; i++){
            var y = this.iB.y - (i*100) - 100;
            this.layer.fillStyle('white');
            this.layer.fillRect(10, y + 10, 80, 80);
            //this.layer.drawImage[this.images[this.inventory[i].image]]
            this.inventory[i].y = y + 10;
            this.inventory[i].x = 10;
            this.inventory[i].w = 80;
            this.inventory[i].h = 80;
        }
    },

    drawSettings(){
        for(var i = 0; i < this.settings.length; i++){
            var y = this.sB.y - (i*100) - 100;
            //this.layer.fillStyle('black');
            //this.layer.fillRect(710, y + 10, 80, 80);
            this.layer.drawImage(this.images[this.settings[i].image], this.settings[i].x, this.settings[i].y)
            this.settings[i].x = 710;
            this.settings[i].y = y + 10;
            this.settings[i].w = 80;
            this.settings[i].h = 80;
        }
    },

    //game
    step: function(){

        this.fantom.x += this.fantom.xs;
        this.fantom.y += this.fantom.ys;

        //collision width border
        if(this.fantom.x > this.width - this.fantom.w - 100){
            this.fantom.x  = this.width - this.fantom.w - 100;
            this.fantom.xs = 0;
        } else if(this.fantom.x < 100){
            this.fantom.x  = 100;
            this.fantom.xs = 0;
        }

        if(this.fantom.y > this.width - this.fantom.h - 100){
            this.fantom.y  = this.height - this.fantom.h - 100;
            this.fantom.ys = 0;
        } else if(this.fantom.y < 110){
            this.fantom.y  = 110;
            this.fantom.ys = 0;
        }

        //collision with items
        for(var i = 0; i < this.objects.length; i++){
            if( this.fantomCollide(this.desk) ){
                var f = this.fantom;
                var o = this.objects[i];

                if((f.x + f.w >= o.x && f.x + f.w <= o.x + 5)){
                    //obj is right
                    f.xs = 0;
                    f.x  = o.x - o.w - 1;
                } else if ((f.x <= o.x + o.w && f.x >= o.x + o.w - 5)){
                    //obj is left
                    f.xs = 0;
                    f.x  = o.x + o.w + 1;
                } else if((f.y + f.h >= o.y && f.y + f.h <= o.y + 5)){
                    //obj is bot
                    f.ys = 0;
                    f.y  = o.y - o.h - 1;
                } else if ((f.y <= o.y + o.h && f.y >= o.y + o.h - 5)){
                    //obj is top
                    f.ys = 0;
                    f.y  = o.y + o.h + 1;
                }
            }//end collision width items
        }

    },

    render: function(){
        this.layer.clear('#333');
        this.layer.fillStyle('black');
        this.layer.strokeStyle('white');
        this.layer.fillRect(100, 100, 600, 600);
        this.layer.strokeRect(100, 100, 600, 600);
        this.layer.strokeRect(250, 300, 100, 100);

        this.layer.drawImage( this.images[this.fantom.image], this.fantom.x, this.fantom.y);

        this.layer.strokeStyle('white');
        this.drawBox(this.sB);
        this.drawBox(this.iB);
        this.drawInventoryContent();
        this.drawSettings();

        this.layer.fillStyle('purple');
        this.layer.fillRect(this.intro.x, this.intro.y, this.intro.w, this.intro.h);
        this.layer.fillStyle('red');
        this.layer.fillRect(this.pB.x, this.pB.y, this.pB.w, this.pB.h);
        this.layer.drawImage(this.images['pB'], this.pB.x, this.pB.y);

    }

});
