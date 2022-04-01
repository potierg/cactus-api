"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketApi = void 0;
class SocketApi {
    static listenEvents(socket, callback) {
        socket.on('start game reveal cards', (data) => {
            // gameId, playerId
            callback('startGame', data);
        });
        socket.on('player draw card', (data) => {
            // gameId, playerId, drawId
            callback('drawCard', data);
        });
        socket.on('player trash card', (data) => {
            // gameId, playerId, trashId
            callback('trashCard', data);
        });
        socket.on('player trash card middle game', (data) => {
            // gameId, playerId, cardId
            callback('trashCardMidddleGame', data);
        });
        socket.on('call cactus', (data) => {
            // gameId, playerId
            callback('callCactus', data);
        });
        // Only on pick 8 card
        socket.on('player reveal card', (data) => {
            // gameId, playerId, cardId
            callback('revealCard', data);
        });
        socket.on('restart game', (data) => {
            callback('restartGame', data);
        });
    }
    static sendPlayerWaitingsList(socket, roomId, data) {
        SocketApi.sendMessage(socket, roomId, 'players waitings', data);
    }
    static sendGameStart(socket, socketId, data) {
        SocketApi.sendMessage(socket, socketId, 'start game', data);
    }
    static sendCardsValues(socket, socketId, cards) {
        SocketApi.sendMessage(socket, socketId, 'cards revealed', cards);
    }
    // When all players revealed them cards
    static playersCanPlay(socket, roomId) {
        SocketApi.sendMessage(socket, roomId, 'players can start', {});
    }
    static playerIdCanPlay(socket, playerId) {
        SocketApi.sendMessage(socket, playerId, 'player can play', {});
    }
    static refreshTrash(socket, roomId, card) {
        SocketApi.sendMessage(socket, roomId, 'refresh trash', card);
    }
    static drawedCard(socket, socketId, card) {
        SocketApi.sendMessage(socket, socketId, 'drawed card', card);
    }
    static successTrashCard(socket, socketId, cardId) {
        SocketApi.sendMessage(socket, socketId, 'success trash middle game', cardId);
    }
    static playerCallCactus(socket, roomId, playerId) {
        SocketApi.sendMessage(socket, roomId, 'cactus called', playerId);
    }
    static playerRevealsCards(socket, roomId, allPlayerCards) {
        SocketApi.sendMessage(socket, roomId, 'reveals all cards', allPlayerCards);
    }
    static gameOver(socket, roomId, winnerId) {
        SocketApi.sendMessage(socket, roomId, 'game over', winnerId);
    }
    static restartGame(socket, roomId) {
        SocketApi.sendMessage(socket, roomId, 'newGame', {});
    }
    static sendMessage(socket, roomId, msg, data) {
        socket.to(roomId).emit(msg, data);
    }
}
exports.SocketApi = SocketApi;
//# sourceMappingURL=socket-api.js.map