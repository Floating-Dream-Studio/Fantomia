function dist(obj, obj2){
    var a = {
        x: obj.x + (obj.w/2),
        y: obj.y + (obj.h/2),
    }
    var b = {
        x: obj2.x + (obj2.w/2),
        y: obj2.y + (obj2.h/2),
    }
    var c = (b.x - a.x) * (b.x - a.x);
    var d = (b.y - a.y) * (b.y - a.y);

    var distance = Math.sqrt(c + d);
    return distance;
};

//items (block)
var desk =  {
    x: 200,
    y: 300,
    w: 64,
    h: 64,
    image: 'table',
    action: () => {
        app.Music.volume = 0.0;
    }
};

//collectables
var lettre = {
    image: 'lettre',
    x: 300,
    y: 300,
    w: 64,
    h: 64
}

//items door
function door(x, y, way){
    this.x = x;
    this.y = y;
    this.w = 50;
    this.h = 50;
    this.type = 'door';
    switch (way) {
        case "up":
            this.go = function(){app.mapUp(); app.canMoove = false; app.fantom.ys = 0;}
            break;
        case "down":
            this.go = function(){app.mapDown(); app.canMoove = false; app.fantom.ys = 0;}
            break;
        case "right":
            this.go = function(){app.mapRight(); app.canMoove = false; app.fantom.xs = 0;}
            break;
        case "left":
            this.go = function(){app.mapLeft(); app.canMoove = false; app.fantom.xs = 0; console.log('left')}
            break;
    }
}

function pnj(x, y, name, image, text){
    this.x = x;
    this.y = y;
    this.w = 50;
    this.h = 50;
    this.type = "pnj";
    this.text = text;
    this.image = image;
}
