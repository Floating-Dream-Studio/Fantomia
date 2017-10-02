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
        //controls
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

        //player
        this.fantom = {
            x: 400,
            y: 200,
            ys: 0,
            xs: 0,
            w: 60,
            h: 100,
            hitbox: {
                x: this.x + 20,
                y: this.y + 20,
                h: 60,
                w: 60
            },
            image: 'ghostieleft'
        }

        //buttons box
        this.iB = {
            x: 0,
            y: 0,
            w: 100,
            h: 100,
            startx: 0,
            starty: 0,
            image: 'iB'
        }

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

        this.ui = [this.sB, this.iB];

        //intro box (tuto)
        this.intro = {
            x: 100,
            y: 100,
            w: 600,
            h: 600,
        }

        this.introDone = false;

        //inventory and settings content
        this.inventory = [{}, {}, {}, {}];

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
            w: 50,
            h: 50,
            image: 'table',
            action: () => {
                console.log('ACTION')
            }
        }

        this.armor = {
            x: 500,
            y: 550,
            w: 50,
            h: 50,
            action: () => {
                console.log('Action 2')
            }
        }

        this.objects = [this.desk, this.armor];

        this.lab = fillLab();
        this.lab[1] = [0,0,0,1,1,1,0,0,0,1,1,1];
        this.lab[0] = [0,0,0,1,1,1,0,0,0,1,1,1];
        this.lab[1] = [0,0,0,1,0,1,0,0,0,0,0,0];

        //this.buildMap(this.lab);

        this.loadImages(
            'iB',
            'setings',
            'g',
            'g2',
            'ghostieback',
            'ghostieleft',
            'ghostieright',
            'ghostiefront',
            'pB',
            'soundOn',
            'soundOff',
            'Am',
            'Fr',
            'play'
        );

        //music load
        this.Music = new Audio;
        this.Music.loop = true;
        this.Music.src  = 'sounds/tra.mp3';
        this.Music.volume = 0.0;
        this.Music.play();
        this.Music.onended = () =>{
            this.Music.play();
        }

        this.loadChapter(1);
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
                    this.fantom.image = 'ghostiefront';
                    break;

                case 'e':
                    this.fantom.collideWith.action();
                    break;
            }
        }

    },

    mousedown: function(e) {
        //play
        if(collide(e.x, e.y, this.pB)){
            this.introDone = true;
            this.tween(this.intro)
                .to({y: -800}, 0.5);
            this.tween(this.pB)
                .to({y: -800}, 0.5);
        }

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

                setTimeout(()=>{
                    this.tween(this.sB)
                        .to({y: this.sB.starty}, 0.5)
                }, 3000);
            }

        }

        //set settings
        for(var i = 0; i < this.settings.length; i++){
            if(collide(e.x, e.y, this.settings[i])){
                this.settings[i].action();
            }
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
            f.collideWith = o;
            return true;
        }
    },

    //maybe redefine whatCollide
    whatCollide: function() {
        var f = this.fantom;
        for(var i = 0; i < this.objects.length; i++){
            var o = this.objects[i];
            if(f.x > o.x + o.w || f.x + f.w < o.x || f.y + f.h < o.y || f.y > o.y + o.h ){
                return false;
            } else {
                return i;
            }
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

    drawObjects(){
        for(var i = 0; i < this.objects.length; i++){
            var o = this.objects[i];
            this.layer.strokeStyle('white');
            this.layer.strokeRect(o.x, o.y, o.w, o.h);
        }
    },

    drawObjectsUi(object){
        for(var i = 0; i < this.objects.length; i++){
            var o = this.objects[i];
            if(o.showUi){
                //this.layer.drawImage()
            }
        }
    },

    loadChapter: function(index){
        chapter[index].load();
        this.chapter = chapter[index];
    },

    displayMap: function(lab) {
        for(var y = 0; y < 12; y++){
            for(var x = 0; x < 12; x++){
                if(lab[y][x] == '1'){
                    this.layer.fillStyle('red');
                    this.layer.fillRect(x*50 + 100, y*50 + 100, 50, 50);
                }
            }
        }
    },

    buildMap: function(lab) {
        for(var y = 0; y < 12; y++){
            for(var x = 0; x < 12; x++){
                if(lab[y][x] == 1){
                    this.objects.push({
                        x: x*50 + 100,
                        y: y*50 + 100,
                        w: 50,
                        h: 50,
                    })
                }
            }

        }
    },

    //game
    step: function(){

        this.fantom.x += this.fantom.xs;
        this.fantom.y += this.fantom.ys;

        this.fantom.hitbox.x = this.fantom.x + 20;
        this.fantom.hitbox.y = this.fantom.y + 20;
        this.fantom.hitbox.w = 60;
        this.fantom.hitbox.h = 60;

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
            if( this.fantomCollide(this.objects[i]) ){
                var f = this.fantom;
                var o = this.objects[i];
                f.collideWith = o;

                if((f.x + f.w >= o.x && f.x + f.w <= o.x + 5)){
                    //obj is right
                    f.xs = 0;
                    f.x  = o.x - f.w - 1;
                } else if ((f.x <= o.x + o.w && f.x >= o.x + o.w - 5)){
                    //obj is left
                    f.xs = 0;
                    f.x  = o.x + o.w + 1;
                } else if((f.y + f.h >= o.y && f.y + f.h <= o.y + 5)){
                    //obj is bot
                    f.ys = 0;
                    f.y  = o.y - f.h - 1;
                } else if ((f.y <= o.y + o.h && f.y >= o.y + o.h - 5)){
                    //obj is top
                    f.ys = 0;
                    f.y  = o.y + o.h + 1;
                }
            } else {
                //this.fantom.collideWith = 'undefined';
            }
        }//end collision width items

    },

    render: function(){
        this.layer.clear('#333');
        this.layer.fillStyle('black');
        this.layer.fillRect(100, 100, 600, 600);

        //this.displayMap(this.lab);

        this.layer.strokeStyle('white');
        this.layer.strokeRect(100, 100, 600, 600);

        this.layer.drawImage( this.images[this.fantom.image], this.fantom.x - (100 - this.fantom.w)/2, this.fantom.y);
        //this.layer.strokeRect(this.fantom.hitbox.x, this.fantom.hitbox.y, 60, 60);
        this.layer.strokeRect(this.fantom.x, this.fantom.y, this.fantom.w, this.fantom.h);

        this.drawBox(this.sB);
        this.drawBox(this.iB);
        this.drawInventoryContent();
        this.drawSettings();
        this.drawObjects();

        //intro
        this.layer.fillStyle('purple');
        this.layer.fillRect(this.intro.x, this.intro.y, this.intro.w, this.intro.h);
        this.layer.drawImage(this.images['play'], this.pB.x, this.pB.y);


        //chapter
        //this.layer.font('32px Arial');
        //this.layer.fillStyle('white');
        //this.layer.fillText('chapitre ' + this.chapter.index + ' : ' + this.chapter.title, 300, 80);
    }

});
