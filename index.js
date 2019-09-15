const express = require('express')
var app = require('express')();
var server = require('http').Server(app);
const router = require('./app/router')
const cors = require('cors')
const config = require('./config')
const Websocket = require('ws')
const fs = require('fs')

if (!fs.existsSync('./wslog.txt')) 
    fs.writeFileSync('./wslog.txt', "--- BEGIN WEBSOCKET LOG ---\n")

let wss = new Websocket.Server({ server })

wss.on('connection', (ws) => {
    console.log('connection')
    ws.on('message', (message) => {
        console.log(message)
        fs.appendFileSync('./wslog.txt', message + "\n")
    })
})

port = config.port

server.listen(config.port);

app.use(cors())

app.use(router)

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
  });
  