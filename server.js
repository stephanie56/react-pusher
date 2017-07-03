const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Pusher = require('pusher');

// create a new server instance
const app = express();

// initialize Pusher with appId, key and secret
const pusher = new Pusher({
  appId: '361911',
  key: '328a64006c2c791550aa',
  secret: '6097b0c0e94b202c02a4',
  cluster: 'us2',
  encrypted: true
});

// parses the text as JSON and exposes the resulting obj on req.body - tells the system that you want JSON to be used
app.use(bodyParser.json());
// tells the system you want to use a simple algo for shallow parsing - convert a nested obj to string
app.use(bodyParser.urlencoded({ extended: false}));

// API route which the chat msg will be sent to
app.post('/message/send', (req, res) => {
  // 'private' is prefixed to indicate that this is a private channel
  pusher.trigger('private-reactchat', 'messages', {
    message: req.body.message,
    username: req.body.username
  });
  res.sendStatus(200);
});

// API route used by Pusher as a way of authenticating users
app.post('pusher/auth', (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const auth = pusher.authenticate(socket_id, channel);
  res.send(auth);
});

// set port to be used by node.js
app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
