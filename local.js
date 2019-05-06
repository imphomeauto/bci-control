const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Mindwave = require("./mindwave");

app.use('/socketiofiles', express.static(__dirname + '/node_modules/socket.io-client/dist/'));
app.use('/chartjsfiles', express.static(__dirname + '/node_modules/chart.js/dist/'));
app.use('/bootstrapfiles', express.static(__dirname + '/node_modules/bootstrap/dist/'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var mw = new Mindwave();

mw.connect('/dev/cu.MindWaveMobile-SerialPo');
//mw.connect('/dev/cu.MindWaveMobile-SerialPo-1');

http.listen(9000, () => {
    console.log('Node server running on port 9000');
});

io.on('connection', function(socket){

    mw.on('eeg', function(eeg){
        socket.emit('eeg', eeg);
    });

    mw.on('attention', function(attention){
        socket.emit('attention', attention);
    });
    
    mw.on('meditation', function(meditation){
        socket.emit('meditation', meditation);
    });
    
    mw.on('blink', function(blink){
        socket.emit('blink', blink);
    });

});
