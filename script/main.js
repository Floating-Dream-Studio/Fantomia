function collide(x, y, object){
    if(x > object.x && x < object.x + object.w && y > object.y && y < object.y + object.h ){
        return true;
    } else {
        return false;
    }
}

var app = playground({

    width : 800,
    height: 1000,
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
            h: 30,
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
        this.inventory = [];

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
        /*this.desk = {
            x: 250,
            y: 300,
            w: 50,
            h: 50,
            image: 'table',
            action: () => {
                console.log('ACTION')
            }
        }

        //this.armor = {
            x: 500,
            y: 550,
            w: 50,
            h: 50,
            action: () => {
                console.log('Action 2')
            }
        }

        //this.objects = [this.desk, this.armor];
        */

        this.itemRed = {
            image: 'c1',
            imagei: 'c1',
            x: 300,
            y: 300,
            w: 50,
            h: 50
        }

        this.collectables = [this.itemRed];
        this.toCollect = [];

        this.actualCollectPannel = {
            //window for collectables items
        };

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
            'play',
            'c1',
            'plancher'
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

        this.loadMap(Manoire);

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
                    if(dist(this.fantom, this.fantom.collideWith) < 60){
                        this.fantom.collideWith.action();
                    }
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

    drawInventoryContent: function(){
        for(var i = 0; i < this.inventory.length; i++){
            var y = this.iB.y - (i*100) - 100;
            this.layer.fillStyle('white');
            this.layer.fillRect(10, y + 10, 80, 80);
            this.layer.drawImage(this.images[this.inventory[i].imagei], 25, y + 25);

            this.inventory[i].yi = y + 10;
            this.inventory[i].xi = 10;
            this.inventory[i].wi = 80;
            this.inventory[i].hi = 80;
        }
    },

    drawSettings: function(){
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

    drawObjects: function(){
        for(var i = 0; i < this.objects.length; i++){
            var o = this.objects[i];
            this.layer.strokeStyle('white');
            this.layer.strokeRect(o.x, o.y, o.w, o.h);
        }
    },

    drawCollectables: function(){
        for(var i = 0; i < this.collectables.length; i++){
            var c = this.collectables[i]
            this.layer.drawImage(this.images[c.image], c.x, c.y);
        }
    },

    getCollectable: function(){
        for(var i = 0; i < this.collectables.length; i++){
            if(this.fantomCollide(this.collectables[i])){
                console.log('collect')
                var c = this.collectables[i];
                var oy = c.y
                this.toCollect.push(c);
                this.inventory.push(c);
                this.collectables.splice(i, 1);
                //console.log(this.toCollect);
                this.tween(c)
                    .to({y: oy - 10},0.2)
                    .to({y: oy}, 0.2, 'outBounce')
                    .to({y: -100, x: -100}, 0.2)
                setTimeout(()=>{
                    this.deleteToCollect();
                }, 700);
            }
        }
    },

    drawToCollect: function(){
        for(var i = 0; i < this.toCollect.length; i++){
            var c = this.toCollect[i];
            this.layer.drawImage(this.images[c.image], c.x, c.y);
        }
    },

    deleteToCollect: function(){
        for(let i = 0; i < this.toCollect.length; i++){
            if(this.inventory.includes(this.toCollect[i])) {
                this.toCollect.splice(i, 1);
            }
        }
    },

    loadMap: function(map){
        this.actualMap   = map;
        this.actualRoomX = map.startx;
        this.actualRoomY = map.starty;
        this.actualRoom  = map.rooms[map.starty][map.startx];
        this.objects = this.actualRoom.items;
        //collectables
        //pnjs
        for(var i = 0; i < map.rooms.length; i++){
            for(var b = 0; b < map.rooms[i].length; b++){
                //this.loadImages(map.rooms[i].image);
                console.log(map.rooms[i][b].image);
            }
        }
    },

    mapUp: function(){
        this.actualRoom.collectables = this.collectables;
        if(this.actualRoomY >= 1){
            var a = this.actualRoomY - 1;
            var b = this.actualRoomX;
            this.actualRoomY = a;
            this.actualRoomX = b;
            this.actualRoom = this.actualMap.rooms[a][b];
            this.transit = true;
            this.objects = this.actualRoom.items;
        }
    },

    mapDown: function(){
        this.actualRoom.collectables = this.collectables;
        if(this.actualRoomY < this.actualMap.rooms.length-1){
            var a = this.actualRoomY + 1;
            var b = this.actualRoomX;
            this.actualRoomY = a;
            this.actualRoomX = b;
            this.actualRoom = this.actualMap.rooms[a][b];
            this.transit = true;
            this.objects = this.actualRoom.items;
            //collectables
        }
    },

    mapRight: function(){
        this.actualRoom.collectables = this.collectables;
        if(this.actualRoomX < this.actualMap.rooms[0].length-1){
            var a = this.actualRoomY;
            var b = this.actualRoomX + 1;
            this.actualRoomY = a;
            this.actualRoomX = b;
            this.actualRoom = this.actualMap.rooms[a][b];
            this.transit = true;
            this.objects = this.actualRoom.items;
            //collectables
        }
    },

    mapLeft: function(){
        this.actualRoom.collectables = this.collectables;
        if(this.actualRoomX >= 1){
            var a = this.actualRoomY;
            var b = this.actualRoomX - 1;
            this.actualRoomY = a;
            this.actualRoomX = b;
            this.actualRoom = this.actualMap.rooms[a][b];
            this.transit = true;
            this.objects = this.actualRoom.items;
            //collectables
        }
    },

    displayMap: function() {
        var bg = this.actualMap.image;
        this.layer.drawImage(bg, 100, 100);
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
            //this.fantom.x  = this.width - this.fantom.w - 100;
            //this.fantom.xs = 0;

            if(this.actualRoomX < 2){
                this.mapRight();
                this.fantom.x  = 100;
            } else {
                this.fantom.x  = this.width - this.fantom.w - 100;
                this.fantom.xs = 0;
            }

        } else if(this.fantom.x < 100){
            //this.fantom.x  = 100;
            //this.fantom.xs = 0;

            if(this.actualRoomX > 0){
                this.mapLeft();
                this.fantom.x  = this.width - this.fantom.w - 100;
            } else {
                this.fantom.x  = 100;
                this.fantom.xs = 0;
            }
        }

        if(this.fantom.y > this.height - this.fantom.h - 100 - 200){
            //this.fantom.y  = this.height - this.fantom.h - 100 - 200;
            //this.fantom.ys = 0;

            if(this.actualRoomY < this.actualMap.rooms.length-1){
                this.mapDown();
                this.fantom.y  = 210;
            } else {
                this.fantom.y  = this.height - this.fantom.h - 100 - 200;
                this.fantom.ys = 0;
            }

        } else if(this.fantom.y < this.actualRoom.wallY){
            //this.fantom.y  = 110;
            //this.fantom.ys = 0;
            if(this.actualRoomY >= 1){
                this.mapUp();
                this.fantom.y  = this.height - this.fantom.h - 100 - 200;
            } else {
                this.fantom.y  = this.actualRoom.wallY;
                this.fantom.ys = 0;
            }
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
        if(this.transit){
            setTimeout(()=>{
                this.transit = false;
            }, 300);
        }
        this.getCollectable();
    },

    render: function(){
        this.layer.clear('#333');
        this.layer.fillStyle('black');
        this.layer.fillRect(100, 100, 600, 600);

        this.layer.drawImage(this.images['plancher'], 100, 100);

        this.layer.strokeStyle('white');
        this.layer.strokeRect(100, 100, 600, 600);


        this.drawBox(this.sB);
        this.drawBox(this.iB);
        this.drawInventoryContent();
        this.drawSettings();
        this.drawObjects();
        this.drawCollectables();
        this.drawToCollect();

        //player
        this.layer.drawImage( this.images[this.fantom.image], this.fantom.x - (100 - this.fantom.w)/2, this.fantom.y - 70);
        //this.layer.strokeRect(this.fantom.x, this.fantom.y, this.fantom.w, this.fantom.h);

        //intro
        this.layer.fillStyle('purple');
        this.layer.fillRect(this.intro.x, this.intro.y, this.intro.w, this.intro.h);
        this.layer.drawImage(this.images['play'], this.pB.x, this.pB.y);

        if(this.transit){
            this.layer.fillStyle('black');
            this.layer.fillRect(100, 100, 600, 600);
        }
        //draw items and collectables pannels

        this.layer.fillStyle('white');
        this.layer.font('32px Arial');
        this.layer.fillText(this.actualRoom.name, 300, 50);
    }

});
