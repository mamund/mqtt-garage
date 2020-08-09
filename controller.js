/* controller */

const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com');

var garageState = '';
var connected = false;

// subscribe on startup
client.on('connect', function() {
  client.subscribe('garage/connected');
  client.subscribe('garage/state');
});

// handle incoming
client.on('message', function(topic, message) {
  switch(topic) {
    case 'garage/connected':
      return handleGarageConnected(message);
    case 'garage/state':
      return handleGarageState(message);
  }
  console.log('no handler for topic %s', topic);
});

function handleGarageConnected(message) {
  console.log('garage connected state is %s', message);
  connected = (message.toString() === 'true');
};

function handleGarageState(message) {
  console.log('garage state update is %s', message);
  garageState = message;
};

/***********************************
 * fire up some messages at startup
 * *********************************/

setTimeout(function() {
  console.log('open door');
  openGarageDoor();

}, 5000);

setTimeout(function() {
  console.log('close door');
  closeGarageDoor();
}, 20000);

function openGarageDoor() {
  if(connected && garageState !== 'open') {
    client.publish('garage/open', 'true');
  }
};

function closeGarageDoor() {
  if(connected && garageState !== 'closed'); {
    client.publish('garage/close', 'true');
  }
};


