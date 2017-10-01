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

        this.inventory = [0, 0, 0, 0];

        this.sB = {
            x: 100,
            y: 0,
            w: 100,
            h: 100,
            image: 'setings'
        }

        this.cursor = {
            x: 0,
            y: 0,
        }

        this.desk = {
            x: 250,
            y: 300,
            w: 100,
            h: 100
        }

        this.ui = [this.sB, this.iB];

        this.loadImages('iB', 'setings', 'g', 'g2',
            'ghostieback',
            'ghostieleft',
            'ghostieright',
            'ghostiefront'
        );

        this.Music = new Audio;
        this.Music.src = 'sounds/tra.mp3';
        this.Music.play();

        app.mouse.lock();
    },

    keydown: function (e) {
        console.log(e.key);

        switch (e.key) {
            case 'q':
                this.fantom.ys = 0;
                this.fantom.xs = -2;
                this.fantom.image = 'ghostieright';
                break;

            case 'd':
                this.fantom.ys = 0;
                this.fantom.xs = 2;
                this.fantom.image = 'ghostieleft';
                break;

            case 'z':
                this.fantom.xs = 0;
                this.fantom.ys = -2;
                this.fantom.image = 'ghostieback';
                break;

            case 's':
                this.fantom.xs = 0;
                this.fantom.ys = 2;
                this.fantom.image = 'ghostiefront';
                break;

            case 'space':
                this.fantom.xs = 0;
                this.fantom.ys = 0;
                break;
        }
    },

    mousedown: function(e) {
        if(collide(e.x, e.y, this.iB)){

            if(this.iB.y != this.iB.starty){
                this.tween(this.iB)
                    .to({y: this.iB.starty}, 0.5)
            } else {
                var modif = this.inventory.length * 100;
                this.tween(this.iB)
                    .to({y: this.iB.starty + modif}, 0.5)
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
        this.cursor.x = e.x;
        this.cursor.y = e.y;
    },

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
        }
    },

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
        if( this.fantomCollide(this.desk) ){
            var f = this.fantom;
            var o = this.desk;

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

    }

});
