var http = require('http');
var express = require('express');
var database = require('./database.js');

var app = express();
var port = 8000;

var followups = require('./app/followups.js',followups);

var bodyParser   = require('body-parser');
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

app.use(express.static('public'));

app.use('/api/followups', followups);

app.get('/*', function(req, res){
   res.sendFile(__dirname + '/views/followUps.html');
});

app.get('/#/*', function(req, res){
   res.sendFile(__dirname + '/views/followUps.html');
});

var server = http.createServer(app);
console.log('Exambazaar loaded on port ' + port);
server.listen(port);