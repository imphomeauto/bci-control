const express = require('express');
const app = express();
const http = require('http');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Mindwave = require("./mindwave");

app.use('/socketiofiles', express.static(__dirname + '/node_modules/socket.io-client/dist/'));
app.use('/chartjsfiles', express.static(__dirname + '/node_modules/chart.js/dist/'));
app.use('/bootstrapfiles', express.static(__dirname + '/node_modules/bootstrap/dist/'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var mw = new Mindwave();

//mw.connect('/dev/cu.MindWaveMobile-SerialPo');
mw.connect('/dev/cu.MindWaveMobile-SerialPo-3');

server.listen(9000, () => {
    console.log('Node server running on port 9000');
});

let attLevel = 0;
let medLevel = 0;
let waveLevel = 0;

let countAtt = 0;
let countMed = 0;
let countBlink = 0;
let countAlarm = 0;
let rawTime = 0;

let isMoving = false;

function goto(destination){
    if(!isMoving){
        isMoving = true;
        console.log('go to ' + destination );
        http.get('http://192.168.1.2:8000/go_' + destination, (response) => {
            response.on('end',function(){
                console.log('Response med: ' + response.data);
                //socket.emit('goto', 'finish');
                isMoving = false;
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
}


async function check (attL, medL, waveL) {

    if(rawTime <= 20){
        rawTime++;
        if ((waveL < -300 || waveL > 300) && countAtt < 1 && countMed < 1){
            countBlink++;
        }
        if (countBlink == 5 && !isMoving){
            goto('kitchen');
        }
    } else {
        rawTime = 0;
        countBlink = 0;
    }

    if(medL >= 80 && countAtt == 0) {
        countMed++;
        if(countMed == 3 && !isMoving) {
            goto('bedroom');
        }
    }
    else countMed = 0;

    if(attL >= 80 && countMed == 0) {
        countAtt++;
        if(countAtt == 3 && !isMoving) {
            goto('toilet');
        }
    }
    else countAtt = 0;

    if(attL < 1 && medL < 1 && waveL == 0) {
        countAlarm++;
        if(countAlarm == 10) {
            
        }
    } else {
        countAlarm = 0;
    }

    
}

io.on('connection', function(socket){

    mw.on('eeg', function(eeg){
        socket.emit('eeg', eeg);
    });

    mw.on('attention', (attention) => { 
        socket.emit('attention', attention);
        attLevel = attention;
    });
    
    mw.on('meditation', function(meditation){
        socket.emit('meditation', meditation);
        medLevel = meditation;
        check(attLevel, medLevel, waveLevel);
        socket.emit('counter', {"att": countAtt, "med": countMed, "blk": countBlink});
    });
    
    mw.on('wave', function(wave){
        socket.emit('wave', wave);
        waveLevel = wave;
    });

    mw.on('signal', function(signal){
        socket.emit('signal', signal);
    });

});
