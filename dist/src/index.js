"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const socketio = __importStar(require("socket.io"));
const http = __importStar(require("http"));
const gameServer_1 = require("./gameServer");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const environment_json_1 = __importDefault(require("../environment/environment.json"));
const app = express.default();
const port = process.env.PORT || environment_json_1.default.apiPort; // default port to listen
const server = http.createServer(app);
const io = new socketio.Server(server);
const gameServer = new gameServer_1.GameServer(io);
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.raw());
app.post("/game/new", (req, res) => {
    const gameId = gameServer.createGame();
    res.json({ gameId });
});
app.post("/game/player/new", (req, res) => {
    if (!gameServer.checkGameExist(req.body.gameId)) {
        res.send({ error: 'Game not exist' });
        return;
    }
    const playerId = gameServer.addPlayer(req.body.gameId, req.body.socketId, req.body.playerName);
    res.send({ playerId, name: req.body.playerName, secretKey: gameServer.getSecretPlayerKey(req.body.gameId, playerId) });
});
app.post("/game/start", (req, res) => {
    if (!gameServer.checkGameExist(req.body.gameId)) {
        res.send({ error: 'Game not exist' });
        return;
    }
    gameServer.startGame(req.body.gameId);
    res.send({});
});
// start the Express server
app.listen(port, () => {
    console.log(`server started at localhost:${port}`);
});
//# sourceMappingURL=index.js.map