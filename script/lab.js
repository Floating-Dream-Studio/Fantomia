var lab = [
    [],
    [],
    [],
]

function fillLab(){
    var lab = []
    for(var y = 0; y < 12; y++){
        line = [];
        for(var x = 0; x < 12; x++){
            line.push(0);
        }
        lab.push(line);
    }
    return lab;
}
