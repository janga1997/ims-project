var mousePressed = false;
var lastX, lastY;
var ctx;
var point;

var socket = io();
var device = io('http://0.0.0.0:3000/api/robots/chappie');

var masterObject = new Vue({
  el: "#masterAbaqus",
  data: {
    generatedPoints: [],
    width: 500,
    height: 500,
    lineWidth: 5,
    selColor: "black"
  }
});


function InitThis() {
    ctx = document.getElementById('myCanvas').getContext("2d");

    $('#myCanvas').mousedown(function (e) {
        mousePressed = true;
        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
    });

    $('#myCanvas').mousemove(function (e) {
        if (mousePressed) {
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        }
    });

    $('#myCanvas').mouseup(function (e) {
        mousePressed = false;
    });
	    $('#myCanvas').mouseleave(function (e) {
        mousePressed = false;
    });
}


function Draw(x, y, isDown) {
    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = masterObject.selColor;
        ctx.lineWidth = masterObject.lineWidth;
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);

        point = [x, masterObject.height - y];
        socket.emit('message', point);
        device.emit('north');

        ctx.closePath();
        ctx.stroke();
    }
    lastX = x; lastY = y;
}
	
function clearArea() {
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    socket.emit('clear', 'janga');

}