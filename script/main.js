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
    //smoothing: false,

    create: function(){
        this.fantom = {
            x: 200,
            y: 200,
            ys: 0,
            xs: 0,
            w: 100,
            h: 100,
            image: 'g'
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

        this.inventory = [];

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

        this.ui = [this.sB, this.iB];

        this.loadImage('iB', 'setings', 'g', 'g2');

        app.mouse.lock();
    },

    keydown: function (e) {
        console.log(e.key);

        switch (e.key) {
            case 'q':
                this.fantom.ys = 0;
                this.fantom.xs = -2;
                this.fantom.image = 'g';
                break;

            case 'd':
                this.fantom.ys = 0;
                this.fantom.xs = 2;
                this.fantom.image = 'g2';
                break;

            case 'z':
                this.fantom.xs = 0;
                this.fantom.ys = -2;
                break;

            case 's':
                this.fantom.xs = 0;
                this.fantom.ys = 2;
                break;

            case 'space':
                this.fantom.xs = 0;
                this.fantom.ys = 2;
                break;
        }
    },

    mousedown: function(e) {
        if(collide(e.x, e.y, this.iB)){

            if(this.iB.y != this.iB.starty){
                this.tween(this.iB)
                    .to({y: this.iB.starty}, 0.5)
            } else {
                this.tween(this.iB)
                    .to({y: this.iB.starty + 100}, 0.5)
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

    drawUi: function(){
        for(var i = 0; i < this.ui.length; i++){
            this.drawBox(this.ui[i]);
        }
    },

    step: function(){

        this.fantom.x += this.fantom.xs;
        this.fantom.y += this.fantom.ys;

        if(this.fantom.x > this.width - this.fantom.w){
            this.fantom.x  = this.width - this.fantom.w;
            this.fantom.xs = 0;
        } else if(this.fantom.x < 0){
            this.fantom.x  = 0;
            this.fantom.xs = 0;
        }

        if(this.fantom.y > this.width - this.fantom.h){
            this.fantom.y  = this.height - this.fantom.h;
            this.fantom.ys = 0;
        } else if(this.fantom.y < 110){
            this.fantom.y  = 110;
            this.fantom.ys = 0;
        }

    },

    render: function(){
        this.layer.clear('#333');
        this.layer.drawImage( this.images[this.fantom.image], this.fantom.x, this.fantom.y);

        this.layer.strokeStyle('white');
        this.drawBox(this.sB);
        this.drawBox(this.iB);

    }


})
