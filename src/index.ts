import * as express from "express";
import * as socketio from "socket.io";
import * as http from "http";
import { GameServer } from "./gameServer";
import cors from 'cors';
import bodyParser from "body-parser";

import config from '../environment/environment.json';

const app = express.default();

const port = process.env.PORT || config.apiPort;

const server = http.createServer(app);
const io = new socketio.Server(server, {
    cors: {
        origin: ["http://localhost:5000", "sheltered-ravine-51287.herokuapp.com"],
    },
});

const gameServer = new GameServer(io);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.post( "/game/new", ( req, res ) => {
    const gameId: number = gameServer.createGame();
    res.json({gameId});
} );

app.post( "/game/player/new", ( req, res ) => {
    if (!gameServer.checkGameExist(req.body.gameId)) {
        res.send({error: 'Game not exist'});
        return;
    }
    const playerId: number = gameServer.addPlayer(req.body.gameId, req.body.socketId, req.body.playerName);
    if (playerId === null) {
        res.send({playerId: null});
        return;
    }
    res.send({playerId, name: req.body.playerName, secretKey: gameServer.getSecretPlayerKey(req.body.gameId, playerId)});
});

app.post( "/game/start", ( req, res ) => {
    if (!gameServer.checkGameExist(req.body.gameId)) {
        res.send({error: 'Game not exist'});
        return;
    }
    gameServer.startGame(req.body.gameId);
    res.send({});
});

app.use(express.static('release',{
    index: false, 
    immutable: true, 
    cacheControl: true,
    maxAge: "30d"
}));

app.get('/', function(request, response) {
    response.sendFile(__dirname+'/index.html')
});


// start the Express server
server.listen(port, () => {
    console.log( `server started at localhost:${ port }` );
});
