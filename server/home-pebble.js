#!/usr/bin/env node

var things = require("./things.js"),
    five = require("johnny-five"),
    board = new five.Board(),

    express = require("express"),
    app = express(),
    server
;

// Wait for connection to our Arduino
board.on("ready", function() {

  // Our Home Pebble API

  // Return an array of things we can control
  app.get("/things", getThings);

  // Take action on a given thing ID
  app.get("/action/:id", activateThing);

  // Create Express server
  server = app.listen(3000, function () {
    var port = server.address().port;
    console.log("Home Pebble listening on port %s", port);
  });

  // Create Johnny-Five objects for each thing
  things.forEach(function(d) {
    d.five = new five.Pin(d.pin);
  });

}); 

// Returns JSON list of things we can control
function getThings(req, res) {
  console.log('getThings');

  // Drop out the Johnny-Five specific key/values
  var simpleThings = things.map(function(thing) {
    return {name: thing.name, action: thing.action};
  });

  res.json({things: simpleThings})
    .status(200).end();
}

// Performs an action on the specified thing
// ID is just index into things
// Action is just toggle high/low for now
function activateThing(req, res) {
  var thing = things[req.params.id];

  console.log('activateThing: ', thing.name);

  // Toggle the pin high/low
  thing.five[thing.five.value ? 'low' : 'high']();

  // Send a response showing the new value
  res.send({status: thing.five.value ? 'On' : 'Off'})
    .status(200).end();
}
