/* garage */

const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com');

/****
 * garage states possible:
 * closed, open, closing, opening
 */

var state = "closed";

client.on('connect', function() {
  client.subscribe('garage/open');
  client.subscribe('garage/close');

  client.publish('garage/connected', 'true');
  sendStateUpdate();
});

client.on('message', function(topic, message) {
  console.log('received message %s %s', topic, message);
  switch(topic) {
    case 'garage/open':
      return handleOpenRequest(message);
    case 'garage/close':
      return handleCloseRequest(message);
  };
});

function handleOpenRequest(message) {
  if(state !== 'open' && state !== 'opening') {
    console.log('opening garage door');
    state = 'opening';
    sendStateUpdate();

    setTimeout(function() {
      state = 'open';
      sendStateUpdate();
    }, 5000);
  };
};

function handleCloseRequest(message) {
  if(state !== 'closed' && state !== 'closing') {
    console.log('closing garage door');
    state = 'closing';
    sendStateUpdate();
    
    setTimeout(function() {
      state = 'closed';
      sendStateUpdate();
    }, 5000);
  }
};

function sendStateUpdate() {
  console.log('sending state %s', state);
  client.publish('garage/state', state);
};

function handleAppExit(options, err) {
  if(err) {
    console.log(err.stack);
  }

  if(options.cleanup) {
    client.publish('garage/connected', 'false');
  }

  if(options.exit) {
    process.exit();
  }
};

process.on('exit', handleAppExit.bind(null, {cleanup:true}));
process.on('SIGNINT', handleAppExit.bind(null, {exit:true}));
process.on('uncaughtException', handleAppExit.bind(null, {exit:true}));

/*
 * EOF
*/
