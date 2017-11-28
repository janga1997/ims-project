'use strict';

var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Victor = require('victor');

var Cylon = require('cylon');

app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'))

function angleBetween(vector1, vector2) {
	var angle = Math.acos(vector2.dot(vector1) / (vector1.length() * vector2.length()));
	angle *= 180/Math.PI;

	return angle;
}

var point = [0, 0];
var previous;
var length, angle;

io.on('connection', function(socket){
  socket.on('message', function(msg){
  	msg = new Victor.fromArray(msg);
    length = msg.subtract(point).length();
    msg.add(point);

    if (point.length() == 0) {
    	angle = msg.verticalAngleDeg();
    }

    else {
	    angle = Math.acos(msg.dot(point) / (msg.length() * point.length()));
	    angle *= 180/Math.PI;
	}

	if (isNaN(angle)){
		console.log('----------------');
		console.log(point+ ', ' + msg);
		console.log('----------------');
	}

    console.log(length + ', ' + angle);

    point = msg;
  });

  socket.on('clear', function(msg) {
  	point = new Victor(0, 0);
  	console.log('Reset to Zero');
  });

});


Cylon.robot({
  name: 'rosie',

  // connections: { bluetooth: {adaptor: 'central', uuid: 'd03972a24e55', module: 'cylon-ble'}},
  // devices: {mip: {driver: 'mip'}},

  north: function () {
  	console.log('Janga Reddy');
  },

  work: function() {

  }
});

// ensure you install the API plugin first:
// $ npm install cylon-api-socket-io
Cylon.api('socketio',
{
  host: '0.0.0.0',
  port: '3000'
});

Cylon.start();

http.listen(5000, function(){
  console.log('listening on *:3000');
});

