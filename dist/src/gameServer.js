"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameServer = void 0;
const game_1 = require("./game");
const socket_api_1 = require("./services/socket-api");
class GameServer {
    constructor(socketIoServer) {
        this.games = {};
        this.socketIoServer = null;
        this.socketIoServer = socketIoServer;
        this.socketIoServer.on('connection', (socket) => {
            console.log('connect', socket.id);
            socket_api_1.SocketApi.listenEvents(socket, this.onSocketEvent.bind(this));
        });
    }
    onSocketEvent(eventType, data) {
        switch (eventType) {
            case 'startGame':
                this.games[data.gameId].revealTwoFirstCards(data.playerId);
                break;
            case 'drawCard':
                this.games[data.gameId].drawCard(data.playerId, data.drawId);
                break;
            case 'trashCard':
                this.games[data.gameId].trashCard(data.playerId, data.trashId);
                break;
            case 'trashCardMidddleGame':
                this.games[data.gameId].trashCardInMiddleGame(data.playerId, data.cardId);
                break;
            case 'revealCard':
                this.games[data.gameId].revealSpecificCard(data.playerId, data.cardId);
                break;
            case 'callCactus':
                this.games[data.gameId].callCactus(data.playerId);
                break;
            case 'restartGame':
                this.games[data.gameId].reset();
                this.games[data.gameId].startGame();
                break;
        }
    }
    createGame() {
        const gameId = Math.floor(Math.random() * 1000);
        this.games[gameId] = new game_1.Game(gameId, this.socketIoServer);
        return gameId;
    }
    startGame(gameId) {
        this.games[gameId].startGame();
    }
    addPlayer(gameId, socketId, playerName) {
        return this.games[gameId].addPlayer(socketId, playerName);
    }
    getSecretPlayerKey(gameId, playerId) {
        return this.games[gameId].getSecretPlayerKey(playerId);
    }
    checkGameExist(gameId) {
        return this.games[gameId] !== undefined;
    }
    checkPlayerExist(gameId, playerId) {
        return this.games[gameId].checkPlayerExist(playerId);
    }
    deleteGame(gameId) {
        this.games[gameId].delete();
        delete this.games[gameId];
    }
}
exports.GameServer = GameServer;
//# sourceMappingURL=gameServer.js.map