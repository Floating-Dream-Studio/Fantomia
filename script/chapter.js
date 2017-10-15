

//rooms Manoire
var manoire1 = {
    name  : 'salon',
    image : 'plancher',
    wallY : 210,
    items : [desk, new door(100, 500, "left"), new door(650, 500, "right")],
    collectables: [lettre],
    up :    {x: 400, y:400 },
    down :  {x: 400, y:400},
    left :  {x: 400, y:400},
    right : {x: 400, y:400},
}

var manoire2 = {
    name  : 'bibliotheque',
    image : 'plancher',
    collectables: [],
    wallY : 210,
    items : [],
    up :    {x: 400, y:400 },
    down :  {x: 400, y:400},
    left :  {x: 650, y:500},
    right : {x: 400, y:400}
}

var manoire3 = {
    name  : 'cave',
    image : 'plancher',
    wallY : 210,
    items : [],
    up : {x: 400, y:400 },
    down :  {x: 400, y:400},
    left : {x: 400, y:400},
    right : {x: 400, y:400}
}

var manoire4 = {
    name : 'salle du boss',
    image: 'plancher',
    items : [],
    wallY : 180,
    up : {x: 400, y:400 },
    down :  {x: 400, y:400},
    left : {x: 400, y:400},
    right : {x: 400, y:400}
}

var Manoire = {
    rooms: [
        [ manoire2, manoire1, manoire3 ],
        [ manoire4, manoire4, manoire4 ]
    ],

    startx: 1,
    starty: 0
}
