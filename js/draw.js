var paths = [], undos = [], controls, path;
var WIDTH = view.viewSize.width, HEIGHT = view.viewSize.height;

makeDatGUI();
var text = new PointText(new Point(10,10));
text.fillColor = "black";

//function onMouseMove() { }

function Controls() {
    //style
    this.strokeColor = "#ff0000";
    this.strokeWidth = 17;
    this.strokeCap = "round";
    this.strokeJoin = "round";
    this.miterLimit = 10;
    this.fillColor = "#ff0000";
    this.closed = false;
    this.fill = false;

    //circle
    this.centerX = 100;
    this.centerY = 100;
    this.radius = 50;

    this.drawCircle = function() { 
        console.log("kek")
        var circle = new Path.Circle(new Point(this.centerX, this.centerY), this.radius);
        circle.type = "circle";
        applyStyle(circle);
        addPath(circle);
    };


    this.undo = function() {
        if(paths.length > 0) {
            var item = removePath();
            item.remove();
            view.draw();
        }
    };
    this.redo = function() {
        if(undos.length > 0) {
            var item = undos.pop();
            project.activeLayer.addChild(item);
            paths.push(item);
            view.draw();
        }
    };
    this.save = function() {
        if(paths.length < 1) return;

        string = '{ "amount": ' + paths.length + ', "paths": [';

        for(var i = 0, l = paths.length; i < l; i++) {
            var p = paths[i];
            //console.log(p);
            string += '{'+
            ' "type": "'+p.type+'", '+                         //string
            '"closed": '+p.closed+', '+                       //boolean
            '"miterLimit": '+p.miterLimit+', '+               //number
            '"strokeWidth": '+p.strokeWidth+', '+             //number
            '"strokeCap": "'+p.strokeCap+'", '+               //string
            '"strokeJoin": "'+p.strokeJoin+'", '+             //string
            '"strokeColor": "'+p.strokeColor+'"';             //bad string
            //end of generic

            switch(p.type) {
                case "freedrawn": string += stringPoints(p); break;
            }

            string += '}, ';
        };

        string = string.slice(0,-2); //remove end comma
        string += '] }';
       // console.log(string);
        var kek = JSON.parse(string);

        replacePopup(string, true);
        jQuery("#frog").trigger(jQuery.Event("click"));
    };
}
//{"amount": 1, "paths": [{"type": "freedrawn", "closed": false, "miterLimit": 10, "strokeWidth": 17, "strokeCap": "round", "strokeJoin": "round", "strokeColor": "{ red: 1, green: 0, blue: 0, alpha: 1 }"}] }
function applyStyle(item) {
    item.strokeWidth = controls.strokeWidth;
    item.strokeColor = controls.strokeColor;
    item.strokeCap = controls.strokeCap;
    item.miterLimit = controls.miterLimit;
    item.strokeJoin = controls.strokeJoin;
    
    if(item.type === "freedrawn") {
        item.closed = controls.closed;
    }

    if(controls.fill && item.type === "circle") {
        item.fillColor = controls.fillColor;
    }
}

function makeDatGUI() {
    controls = new Controls();
    var gui = new dat.GUI();

    var style_folder = gui.addFolder('Style');
    style_folder.addColor(controls, "strokeColor");
    style_folder.add(controls, "strokeWidth", 0, 50).step(1);
    style_folder.add(controls, "miterLimit", 0, 50).step(1);
    style_folder.add(controls, "strokeCap", ["round","square","butt"]);
    style_folder.add(controls, "strokeJoin", ["miter","round","bevel"]);
    style_folder.add(controls, "closed");
    var fill = style_folder.add(controls, "fill");

    var circle_folder = gui.addFolder("Circle");
    circle_folder.add(controls, "centerX", 0, WIDTH).step(1);
    circle_folder.add(controls, "centerY", 0, HEIGHT).step(1);
    circle_folder.add(controls, "radius", 0, 200).step(1);
    circle_folder.add(controls, "drawCircle");

    gui.add(controls, "undo");
    gui.add(controls, "redo");
    var save = gui.add(controls, "save");
    $(save.domElement).attr('id', 'frog');

    style_folder.open();
    circle_folder.open();

    var fillColor;
    fill.onChange(function(value) {
        if(value) fillColor = style_folder.addColor(controls, "fillColor");
        else style_folder.remove(fillColor);
    });
}

function onMouseDown(event) {
    path = new Path();
    path.add(event.point);
    path.type = "freedrawn"
    applyStyle(path);

    addPath(path);
}

function onMouseDrag(event) {
    path.add(event.point);
    //console.log(paths);
}

function onMouseUp(event) {
    //path.simplify(10);
   // path.selected = true;
}

function addPath(item) {
    view.draw();
    paths.push(item);
    undos = [];
}

function removePath() {
    var item = paths.pop();
    undos.push(item);
    if(item) return item;
}

function stringPoints(p) {
    var str, seg = p.segments;
    //console.log(seg)
    str = ', "points": ['

    for(var i = 0, l = seg.length; i < l; i++) {
        var x = seg[i].point.x, y = seg[i].point.y;
        str += '{"x":'+x+',"y":'+y+'},';
    }
    str = str.slice(0,-1);
    str += '] ';

    return str;
}

var pop = $('#frog')
pop.avgrund({
    height: 200,
    holderClass: 'custom',
    template: '<textarea rows="9" cols="44">dat json</textarea>'
});

function replacePopup(string, save) {
    var replace;
    if(save) {
        replace = '<textarea rows="12" cols="44">'+string+'</textarea>'
    }
    else { 
        replace = '<textarea rows="9" cols="44">'+string+'</textarea>'+
        '<div><a href="http://github.com/voronianski/jquery.avgrund.js" target="_blank" class="clicky">Avgrund on Github</a></div>'
    }
    $(".custom").html(replace);
}