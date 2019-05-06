const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MongoClient = require("mongodb").MongoClient;

app.use('/socketiofiles', express.static(__dirname + '/node_modules/socket.io-client/dist/'));
app.use('/chartjsfiles', express.static(__dirname + '/node_modules/chart.js/dist/'));
app.use('/bootstrapfiles', express.static(__dirname + '/node_modules/bootstrap/dist/'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

const uri = "mongodb+srv://...";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {

    http.listen(9000, () => {
        console.log('Node server running on port 9000');
    });

    io.on('connection', function(socket){

        const collection = client.db("iha").collection("reads");
  
        const changeStream = collection.watch();
        
        changeStream.on('change', (change) => {
            
            if(change.operationType === 'insert') {
                const task = change.fullDocument;
                socket.emit('read', task);
            }
    
        });

    });
  
});

