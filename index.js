const express = require("express");
var app = require("express")();
var server = require("http").Server(app);
const router = require("./app/router");
const cors = require("cors");
const config = require("./config");
const Websocket = require("ws");
const fs = require("fs");
const ipc = require('node-ipc');

const socketPath = '/tmp/ipc.sock';

if (!fs.existsSync("./wslog.txt"))
  fs.writeFileSync("./wslog.txt", "--- BEGIN WEBSOCKET LOG ---\n");

let wss = new Websocket.Server({ server });

wss.on("connection", ws => {
  console.log("connection");
  ws.on("message", message => {
    console.log(message);
    fs.appendFileSync("./wslog.txt", message + "\n");
  });
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({status: '500', msg: 'There was an error'})
});

port = config.port;

server.listen(config.port);

app.use(cors());

app.use(router);

app.use(function(req, res, next) {
    res.status(404).json({'status': '404 NOT FOUND', msg: 'PAGE NOT FOUND'})
});

ipc.connectTo(
  'world',
  socketPath,
  connecting
);

function connecting(socket) {
  ipc.of.world.on(
    'connect',
    function() {
      ipc.of.world.emit(
        'processlocationrequest',
        { location: 'Example.Building:1:A'}
      ); // send this every ~5 minutes

      ipc.of.world.emit(
        'tmpstoredatarequest',
        { location: 'Example.Building:1:A', device: '1' }
      ); // assuming each location has more than 1 device,
      // use this to store that device data until processlocationrequest is done

      ipc.disconnect('world');
    }
  );
}

process.on("uncaughtException", function(err) {
  console.log("Caught exception: " + err);
});
