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

        //game state

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
        this.canMoove = true;

        this.transit = {
            alpha: 0,
            show: false,
        }

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
            image: 'ghostieleft',

            animations : {
                idle : ['idle/ghostiefront', 'idle/ghostieleft'],
                left : ['left/000', 'left/001', 'left/002', 'left/003', 'left/004', 'left/005'],
                right: ['right/000', 'right/001', 'right/002', 'right/003', 'right/004', 'right/005'],
                bottom:['ghostiefront'],
                up:['ghostieback']
            },

            animations2: {
                idle : 'idle',
                left: 'left',
                right:'right',
                up:'idle',
                bottom:'bottom'
            },

            delay : {
                idle: 6,
                left: 6,
                right: 6,
                bottom: 6,
                up: 6,
            },
            actualAnimation : 'idle',
            index: 0,
            indexy:0,
            count: 0,
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

        this.itemRed = {
            image: 'c1',
            imagei: 'c1',
            x: 300,
            y: 300,
            w: 50,
            h: 50
        }

        this.collectables = [];//[this.itemRed];
        this.toCollect = [];
        this.showCollectables = true;

        this.actualCollectPannel = {
            //window for collectables items
        };

        this.popUpShow = true;
        this.popUp = {
            image : "test",
            x : 200,
            y : 1050,
            w : 400,
            h : 200
        }
        //this.buildMap(this.lab);

        this.loadImages(
            'iB',
            'setings',
            'pB',
            'soundOn',
            'soundOff',
            'Am',
            'Fr',
            'play',
            'c1',
            'plancher'
        );
        this.loadAnim();
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
        this.popDown();
        if(this.introDone && this.canMoove){
            switch (e.key) {
                case this.controls.left:
                    this.fantom.ys = 0;
                    this.fantom.xs = -2;
                    this.fantom.index = 0;
                    this.fantom.actualAnimation = 'left';
                    break;

                case this.controls.right:
                    this.fantom.ys = 0;
                    this.fantom.xs = 2;
                    this.fantom.index = 0;
                    this.fantom.actualAnimation = 'right';
                    break;

                case this.controls.up:
                    this.fantom.xs = 0;
                    this.fantom.ys = -2;
                    this.fantom.index = 0;
                    this.fantom.actualAnimation = 'up';
                    break;

                case this.controls.down:
                    this.fantom.xs = 0;
                    this.fantom.ys = 2;
                    this.fantom.index = 0;
                    this.fantom.actualAnimation = 'bottom';
                    break;

                case 'space':
                    this.fantom.xs = 0;
                    this.fantom.ys = 0;
                    this.fantom.index = 0;
                    this.fantom.actualAnimation = 'idle';
                    break;

                case 'e':
                    if(dist(this.fantom, this.fantom.collideWith) < 60){
                        this.fantom.collideWith.action();
                    }
                    break;
                case 'a':
                    this.popTop();
                    break;
                case 'b':
                    this.popDown();
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

    drawInventoryContent: function() {
        for(var i = 0; i < this.inventory.length; i++){
            var y = this.iB.y - (i*100) - 100;
            this.layer.fillStyle('white');
            this.layer.fillRect(10, y + 10, 80, 80);
            var img = this.images[this.inventory[i].image];
            this.layer.context.drawImage(img, 0, 0, img.width, img.height, 10, y + 10, 80, 80);

            this.inventory[i].yi = y + 10;
            this.inventory[i].xi = 10;
            this.inventory[i].wi = 80;
            this.inventory[i].hi = 80;
        }
    },

    drawSettings: function() {
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

    drawObjects: function() {
        if(this.showCollectables){
            for(var i = 0; i < this.actualRoom.items.length; i++){
                var o = this.actualRoom.items[i];
                this.layer.strokeStyle('white');
                this.layer.strokeRect(o.x, o.y, o.w, o.h);
                if(o.image){
                    this.layer.drawImage(this.images[o.image], o.x, o.y);
                }
            }
        }
    },

    drawCollectables: function() {
        if(this.actualRoom.collectables && this.showCollectables){
            for(var i = 0; i < this.actualRoom.collectables.length; i++){
                var c = this.actualRoom.collectables[i]
                this.layer.drawImage(this.images[c.image], c.x, c.y);
            }
        }
    },

    getCollectable: function() {
        if(this.actualRoom.collectables){
            for(var i = 0; i < this.actualRoom.collectables.length; i++){
                if(this.fantomCollide(this.actualRoom.collectables[i])){
                    console.log('collect')
                    var c = this.actualRoom.collectables[i];
                    var oy = c.y
                    this.toCollect.push(c);
                    this.inventory.push(c);
                    this.actualRoom.collectables.splice(i, 1);
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
        }
    },

    drawToCollect: function() {
        for(var i = 0; i < this.toCollect.length; i++){
            var c = this.toCollect[i];
            this.layer.drawImage(this.images[c.image], c.x, c.y);
        }
    },

    deleteToCollect: function() {
        for(let i = 0; i < this.toCollect.length; i++){
            if(this.inventory.includes(this.toCollect[i])) {
                this.toCollect.splice(i, 1);
            }
        }
    },

    loadCollectables: function(room) {
        for(var i = 0; i < room.collectables.length; i++){
            this.loadImages(room.collectables[i].image);
        }
    },

    loadItems: function(room) {
        for(var i = 0; i < room.items.length; i++){
            this.loadImages(room.items[i].image);
        }
    },

    loadAnim: function() {
        this.loadImages('left', 'right', 'up', 'bottom', 'idle');
    },

    loadMap: function(map) {
        this.actualMap   = map;
        this.actualRoomX = map.startx;
        this.actualRoomY = map.starty;
        this.actualRoom  = map.rooms[map.starty][map.startx];
        //this.objects = this.actualRoom.items;
        this.bg = this.actualRoom.image;
        //collectables
        //pnjs
        for(var i = 0; i < map.rooms.length; i++){
            for(var b = 0; b < map.rooms[i].length; b++){
                this.loadImages(map.rooms[i][b].image);
                if(map.rooms[i][b].collectables){
                    this.loadCollectables(map.rooms[i][b]);
                    this.loadItems(map.rooms[i][b]);
                }
            }
        }
    },

    drawMap: function() {
        //var mapImage = this.actualRoom.image;
        //var img = this.images[mapImage];
        if(this.bg){
            var img = this.images[this.bg];
            this.layer.drawImage(img, 100, 100);
        }
    },

    drawTransition: function(){
        if(true){
            this.layer.save();
            this.layer.a(this.transit.alpha);
            this.layer.fillStyle('black');
            this.layer.fillRect(100,100,600,600);
            this.layer.restore();
        }
    },

    lauchTransition: function(way) {
        this.transit.show = true;
        this.canMoove = false;
        this.showCollectables = false;
        setTimeout(()=>{
            this.transit.show = false;
            this.showCollectables = true;
            this.canMoove = true;
            this.bg = this.actualRoom.image;
            if(this.actualRoom.items){
                this.objects = this.actualRoom.items;
            }
            if(this.actualRoom.collectables){
                this.collectables = this.actualRoom.collectables;
            }
            this.fantom.y = this.actualRoom[way].y;//y;
            this.fantom.x = this.actualRoom[way].x;//x;
        }, 1000);
        this.tween(this.transit)
            .to({alpha: 1}, 0.5).wait(0.5)
            .to({alpha: 0}, 0.8)
    },

    mapUp: function() {
        //this.actualRoom.collectables = this.collectables;
        if(this.actualRoomY >= 1){
            this.lauchTransition('up');
            var a = this.actualRoomY - 1;
            var b = this.actualRoomX;
            this.actualRoomY = a;
            this.actualRoomX = b;
            this.actualRoom = this.actualMap.rooms[a][b];
            //this.objects = this.actualRoom.items;
        }
    },

    mapDown: function() {
        //this.actualRoom.collectables = this.collectables;
        if(this.actualRoomY < this.actualMap.rooms.length-1){
            this.lauchTransition('down');
            var a = this.actualRoomY + 1;
            var b = this.actualRoomX;
            this.actualRoomY = a;
            this.actualRoomX = b;
            this.actualRoom = this.actualMap.rooms[a][b];
        }
    },

    mapRight: function() {
        //this.actualRoom.collectables = this.collectables;
        if(this.actualRoomX < this.actualMap.rooms[0].length-1){
            this.lauchTransition('right');
            var a = this.actualRoomY;
            var b = this.actualRoomX + 1;
            this.actualRoomY = a;
            this.actualRoomX = b;
            this.actualRoom = this.actualMap.rooms[a][b];
        }
    },

    mapLeft: function() {
        //this.actualRoom.collectables = this.collectables;
        if(this.actualRoomX >= 1){
            this.lauchTransition('left');
            var a = this.actualRoomY;
            var b = this.actualRoomX - 1;
            this.actualRoomY = a;
            this.actualRoomX = b;
            this.actualRoom = this.actualMap.rooms[a][b];
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

    drawMiniMap: function (x, y) {
        var map = this.actualMap.rooms;
        for(var a = 0; a < map.length; a++){
            for(var b = 0; b < map[a].length; b++){
                this.layer.fillStyle("red");
                this.layer.fillRect(x + b*100, y + a*100, 100, 100);
                var img = this.images[map[a][b].image];
                this.layer.context.drawImage(img, 0, 0, 600, 600, x+b*100, y+a*100, 100, 100);
            }
        }
        this.layer.strokeStyle('white');
        this.layer.strokeRect(x, y, 300, 200);
        this.layer.fillStyle('red');
        this.layer.a(0.3);
        this.layer.fillRect(x + this.actualRoomX*100, y + this.actualRoomY*100, 100, 100);
        this.layer.a(1);
    },

    updateFantom: function(){
        var fantom = this.fantom;
        var animation = fantom.animations2[fantom.actualAnimation];

        var count = fantom.delay[fantom.actualAnimation];
        var maxIndex = this.images[animation].width/100;
        console.log(animation)

        if(fantom.count < count ){
            fantom.count += 1;
        } else if (fantom.count >= count) {
            fantom.count = 0;
            if(fantom.index < maxIndex-1){
                fantom.index += 1;
                //console.log(fantom.indexy)
            } else if(fantom.index >= maxIndex-1) {
                fantom.index = 0;
            }
            //console.log(animation.length)
        }

    },

    drawFantom: function(){
        let index = this.fantom.index;
        let actualAnimation = this.fantom.actualAnimation;
        let imga = this.fantom.animations2[actualAnimation];
        let img = this.images[imga];
        let x = index*100;
        let xf = this.fantom.x - (100 - this.fantom.w)/2;
        let yf = this.fantom.y - 70;
        this.layer.context.drawImage(img, x, 0, 100, 100, xf, yf, 100, 100);
        //console.log(x)
    },

    //pnj
    drawPopUp: function(){
        this.layer.fillRect(this.popUp.x, this.popUp.y, this.popUp.w, this.popUp.h);
    },

    popTop: function() {
        if(this.popUpShow && this.popUp.y >= 1050){
            this.tween(this.popUp)
                .to({y: 300}, 0.5)
        }
    },

    popDown: function() {
        if(this.popUpShow && this.popUp.y < 1050){
            this.tween(this.popUp)
                .to({y: 1050}, 0.5)
        }
    },

    //game
    step: function(){

        if(this.canMoove){
            this.fantom.x += this.fantom.xs;
            this.fantom.y += this.fantom.ys;
        }

        this.fantom.hitbox.x = this.fantom.x + 20;
        this.fantom.hitbox.y = this.fantom.y + 20;
        this.fantom.hitbox.w = 60;
        this.fantom.hitbox.h = 60;

        //collision width border
        /*
        if(this.fantom.x > this.width - this.fantom.w - 100){
            this.fantom.xs = 0;
            this.fantom.x = this.width - this.fantom.w - 101;

            if(this.actualRoomX < 2){
                let x  = 101;
                let y  = this.fantom.y;
                this.mapRight(x, y);
                this.canMoove = false;
            } else {
                this.fantom.x  = this.width - this.fantom.w - 101;
                this.fantom.xs = 0;
            }

        } else if(this.fantom.x < 100){
            this.fantom.xs = 0;
            this.fantom.x  = 101;

            if(this.actualRoomX > 0){
                let x  = this.width - this.fantom.w - 101;
                let y = this.fantom.y;
                this.mapLeft();
                this.canMoove = false;

            } else {
                this.fantom.x  = 101;
                this.fantom.xs = 0;
            }
        }

        if(this.fantom.y > this.height - this.fantom.h - 100 - 200){
            //this.fantom.y  = this.height - this.fantom.h - 100 - 200;
            this.fantom.ys = 0;

            if(this.actualRoomY < this.actualMap.rooms.length-1){
                let x = this.fantom.x;
                let y = 210;
                this.mapDown();
                this.canMoove = false;
            } else {
                this.fantom.y  = this.height - this.fantom.h - 100 - 201;
                this.fantom.ys = 0;
            }

        } else if(this.fantom.y < this.actualRoom.wallY){
            //this.fantom.y  = 110;
            this.fantom.ys = 0;
            if(this.actualRoomY >= 1){
                let x = this.fantom.x;
                let y = this.height - this.fantom.h - 100 - 200;
                this.mapUp();
                this.canMoove = false;
            } else {
                this.fantom.y  = this.actualRoom.wallY;
                this.fantom.ys = 0;
            }
        }
        */

        if(this.fantom.x < 100){
            this.fantom.xs = 0;
            this.fantom.x  = 101;

        } else if (this.fantom.x > this.width - 100 - this.fantom.w) {
            this.fantom.xs = 0;
            this.fantom.x  = this.width - 101 - this.fantom.w;
        }

        if(this.fantom.y < this.actualRoom.wallY){
            this.fantom.ys = 0;
            this.fantom.y  = this.actualRoom.wallY;

        } else if (this.fantom.y > 700 - this.fantom.h) {
            this.fantom.ys = 0;
            this.fantom.y  = 700 - this.fantom.h - 1;
        }

        //collision with items
        if(this.actualRoom){
            for(var i = 0; i < this.actualRoom.items.length; i++){
                if( this.fantomCollide(this.actualRoom.items[i]) ){
                    var f = this.fantom;
                    var o = this.actualRoom.items[i];
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

                    if(o.type == 'door'){
                        o.go();
                    }
                }

            }//end collision width items
        }

        this.getCollectable();
        this.updateFantom();

    },

    render: function(){

        this.layer.clear('#333');
        this.layer.fillStyle('black');
        this.layer.fillRect(100, 100, 600, 600);

        //this.layer.drawImage(this.images['plancher'], 100, 100);
        this.drawMap();

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
        //this.layer.drawImage( this.images[this.fantom.image], this.fantom.x - (100 - this.fantom.w)/2, this.fantom.y - 70);
        this.drawFantom();
        this.layer.strokeRect(this.fantom.x, this.fantom.y, this.fantom.w, this.fantom.h);


        //intro
        this.layer.fillStyle('purple');
        this.layer.fillRect(this.intro.x, this.intro.y, this.intro.w, this.intro.h);
        this.layer.drawImage(this.images['play'], this.pB.x, this.pB.y);

        this.drawTransition();

        //draw items and collectables pannels

        this.layer.fillStyle('white');
        this.layer.font('32px Arial');
        this.layer.fillText(this.actualRoom.name, 300, 50);

        //this.layer.fillRect(100, 750, 30, 20)
        this.drawMiniMap(100, 750);

        this.drawPopUp();

    }

});
