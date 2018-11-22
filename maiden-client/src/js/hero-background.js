var width, height, center;

var path         = new Path();
var mousePos     = view.center / 2;
var pathHeight   = mousePos.y;
var points       = 10;

path.strokeColor = "#CC5555";
path.strokeWidth = 2;
path.opacity     = .2

lineAngle        = 30
baseWiggle       = 30
wiggleMultiplier = 0.9
fromTop          = 200


//////////////////////////////////////////////////////////////

initializePath();

//////////////////////////////////////////////////////////////


function initializePath() {
  center = view.center;
  width = view.size.width;
  height = view.size.height / 2;
  path.segments = [];
  path.add(view.bounds.bottomLeft);
  for (var i = 1; i < points; i++) {
    var point = new Point(width / points * i, center.y);
    path.add(point);
  }
  path.add(view.bounds.bottomRight);
}


function onFrame(event) {
  pathHeight += (center.y - mousePos.y - pathHeight) / 10;
  for (var i = 0; i <= points; i++) {

    // path motion

    var sinSeed = event.count + (i + i % 10) * 60;
    var sinHeight = Math.sin(sinSeed / 200) * pathHeight / ( 3 / wiggleMultiplier ) + baseWiggle;
    var yPos = Math.sin(sinSeed / 150) * sinHeight - (i * lineAngle) + (height + fromTop);
    path.segments[i].point.y = yPos;

    // circles

    if (path.segments[i].circle)
      path.segments[i].circle.remove()

    path.segments[i].circle = new Path.Circle([0, 0], 3);
    path.segments[i].circle.fillColor = "#cc5555";
    path.segments[i].circle.position = path.segments[i].point;
  }

}


function onMouseMove(event) {
  mousePos = event.point;
}


function onResize(event) {
  initializePath();
}