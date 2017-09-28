var app = playground({

    width: 800,
    height: 800,
    smoothing: false,

    create: function(){
        this.fantom = {
            x: 200,
            y: 200,
            ys: 0,
            xs: 0,
            w: 100,
            h: 100
        }

    },

    keydown: function (e) {
        console.log(e.key);

        switch (e.key) {
            case 'q':
                this.fantom.ys = 0;
                this.fantom.xs = -1;
                break;

            case 'd':
                this.fantom.ys = 0;
                this.fantom.xs = 1;
                break;

            case 'z':
                this.fantom.xs = 0;
                this.fantom.ys = -1;
                break;

            case 's':
                this.fantom.xs = 0;
                this.fantom.ys = 1;
                break;
        }


    },

    step: function(){
        this.fantom.x += this.fantom.xs;
        this.fantom.y += this.fantom.ys;
    },

    render: function(){
        this.layer.clear('#333');
        this.layer.fillStyle('white');
        this.layer.fillRect( this.fantom.x, this.fantom.y, 100, 100);
    }


})
