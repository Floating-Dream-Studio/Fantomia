

//rooms Manoire
var manoire1 = {
    name  : 'salon',
    image : 'salon',
    wallY : 210,
    items : [desk]
}

var manoire2 = {
    name  : 'bibliotheque',
    image : 'biblio',
    wallY : 210,
    items : []
}

var manoire3 = {
    name  : 'cave',
    image : 'cave',
    wallY : 210,
    items : []
}

var manoire4 = {
    name : 'salle du boss',
    items : [],
    wallY : 180
}

var Manoire = {
    rooms: [
        [ manoire2, manoire1, manoire3 ],
        [ manoire4, manoire4, manoire4 ]
    ],

    startx: 1,
    starty: 0
}
