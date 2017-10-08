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
