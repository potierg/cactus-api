"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gameServer_1 = require("./gameServer");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const environment_json_1 = __importDefault(require("../environment/environment.json"));
const app = (0, express_1.default)();
const port = environment_json_1.default.apiPort; // default port to listen
const io = new socket_io_1.Server(environment_json_1.default.socketPort, { cors: { origin: '*' } });
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
    console.log(`server started at ${environment_json_1.default.hostUrl}:${port}`);
});
//# sourceMappingURL=index.js.map