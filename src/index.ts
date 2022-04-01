import express from "express";
import { GameServer } from "./gameServer";
import { Server } from "socket.io";
import cors from 'cors';
import bodyParser from "body-parser";

import config from '../environment/environment.json';

const app = express();
const port = process.env.PORT || config.apiPort; // default port to listen

const io = new Server(config.socketPort, { cors: { origin: '*' } });

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

// start the Express server
app.listen( port, () => {
    console.log( `server started at localhost:${ port }` );
} );