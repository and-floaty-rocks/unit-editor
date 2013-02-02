var paths = [], undos = [], controls, path;
var WIDTH = view.viewSize.width, HEIGHT = view.viewSize.height;

makeDatGUI();
var text = new PointText(new Point(10,10));
text.fillColor = "black";

function Controls() {
    //style
    this.strokeColor = "#ff0000";
    this.strokeWidth = 17;
    this.strokeCap = "round";
    this.strokeJoin = "round";
    this.miterLimit = 10;
    this.fillColor = "#ff0000";
    this.closed = false;

    //circle
    this.centerX = 100;
    this.centerY = 100;
    this.radius = 50;

    this.drawCircle = function() { 
        console.log("kek")
        var circle = new Path.Circle(new Point(this.centerX, this.centerY), this.radius);
        circle.strokeColor = "black"
        circle.type = "circle";
        applyStyle(circle);
        addPath(circle);
    };
    this.undo = function() {
        if(paths.length > 0) {
            var item = removePath();
            item.remove();
        }
    };
    this.redo = function() {
        if(undos.length > 0) {
            var item = undos.pop();
            project.activeLayer.addChild(item);
            paths.push(item);
        }
    }
}

function applyStyle(item) {
    item.strokeWidth = controls.strokeWidth;
    item.strokeColor = controls.strokeColor;
    item.strokeCap = controls.strokeCap;
    item.miterLimit = controls.miterLimit;
    item.strokeJoin = controls.strokeJoin;
    
    if(item.type !== "circle") {
        item.closed = controls.closed;
    }
}

function onMouseMove(event) {
    text.content = event.point.toString();
}

function makeDatGUI() {
    controls = new Controls();
    var gui = new dat.GUI();


    var style_folder = gui.addFolder('Style');
    style_folder.addColor(controls, "strokeColor");
    style_folder.add(controls, "strokeWidth", 0, 50).step(.25);
    style_folder.add(controls, "miterLimit", 0, 50).step(.25);
    style_folder.add(controls, "strokeCap", ["round","square","butt"]);
    style_folder.add(controls, "strokeJoin", ["miter","round","bevel"]);
    style_folder.add(controls, "closed");

    var circle_folder = gui.addFolder("Circle");
    circle_folder.add(controls, "centerX", 0, WIDTH);
    circle_folder.add(controls, "centerY", 0, HEIGHT);
    circle_folder.add(controls, "radius", 0, 200);
    circle_folder.add(controls, "drawCircle");

    gui.add(controls, "undo");
    gui.add(controls, "redo");


    style_folder.open();
    circle_folder.open();
}

function onMouseDown(event) {
    path = new Path();
    path.add(event.point);
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
   // console.log(path)
   // console.log(path.style)

}

function addPath(item) {
    paths.push(item);
    undos = [];
}

function removePath() {
    var item = paths.pop();
    undos.push(item);
    if(item) return item;
}

/*
Path
-closed: boolean
-segments: array
-style: object
    miterLimit: num
    strokeCap: string
    strokeColor.cssString: string
    strokeJoin: string
    strokeWidth: num

*/