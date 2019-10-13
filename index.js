// S01. 必要なモジュールを読み込む
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let port = process.env.PORT || 3000;

let nameVal = '';

// idArray = { 名前 ： id, 名前 ： id }
let idArray = {};

// S02. HTTPサーバを生成する
app.get('/', function(req, res){
    // クライアントのパスを指定
    res.sendFile(__dirname + '/index.html');
});

// S03. HTTPサーバにソケットをひも付ける（WebSocket有効化）
http.listen(port, function(){
    console.log('server listening. Port:' + port);
});

// S04. connectionイベント・データを受信する
io.on('connection', function(socket){

    let name;
    // S05. client_to_serverイベント・データを受信する
    socket.on('client_to_server', function(data) {
        // S06. server_to_clientイベント・データを送信する
        console.log("hogehoge01");
        console.log("data ", data.value);
        io.sockets.emit('server_to_client', {value : data.value});
        if(data.value === "正解は") {
            console.log(idArray["寺口"]);
            console.log(idArray["宮内"]);
            io.to(idArray["寺口"]).emit('server_to_client_test', {value : "正解です"});
            io.to(idArray["宮内"]).emit('server_to_client_test', {value : "不正解です"});
        }
    });
    // S07. client_to_server_broadcastイベント・データを受信し、送信元以外に送信する
    socket.on('client_to_server_broadcast', function(data) {
        console.log("hogehoge02");
        socket.broadcast.emit('server_to_client', {value : data.value});
    });
    // S08. client_to_server_personalイベント・データを受信し、送信元だけに送信する
    socket.on('client_to_server_personal', function(data) {
        let id = socket.id;
        name = data.value;
        // console.log(name + "のid:は", id);
        let personalMessage = "あなたは、" + name + "さんとして入室しました。";
        io.to(id).emit('server_to_client', {value : personalMessage});

        idArray[name] = id;
        console.log("hogehoge03");
        // if(name === "寺口") {
        //     io.sockets.emit('server_to_client_test', {value : data.value});
        // }
        // if(name === "宮内") {
        //     io.sockets.emit('server_to_client_test02', {value : data.value});
        // }
    });


});

