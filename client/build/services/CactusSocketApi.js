"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CactusSocketApi = void 0;
class CactusSocketApi {
    static listenEvents(socket, callback) {
        socket.on('cards revealed', (cards) => {
            callback('cardsRevealed', cards);
        });
        socket.on('players can start', () => {
            callback('playersStart');
        });
        socket.on('player can play', () => {
            callback('playerPlay');
        });
        socket.on('refresh trash', (card) => {
            callback('refreshTrash', card);
        });
        socket.on('drawed card', (card) => {
            callback('drawedCard', card);
        });
        socket.on('success trash middle game', (cardId) => {
            callback('successTrash', cardId);
        });
        socket.on('cactus called', (playerId) => {
            callback('cactus', playerId);
        });
        socket.on('reveals all cards', (playerCards) => {
            callback('revelation', playerCards);
        });
        socket.on('game over', (winnerId) => {
            callback('gameOver', winnerId);
        });
        socket.on('new game', () => {
            callback('newGame');
        });
    }
    static startGame(socket, gameId, playerId) {
        socket.emit('start game reveal cards', {
            gameId, playerId
        });
    }
    static drawCard(socket, gameId, playerId, drawId) {
        socket.emit('player draw card', {
            gameId, playerId, drawId
        });
    }
    static trashCard(socket, gameId, playerId, trashId) {
        socket.emit('player trash card', {
            gameId, playerId, trashId
        });
    }
    static trashCardMiddleGame(socket, gameId, playerId, cardId) {
        socket.emit('player trash card middle game', {
            gameId, playerId, cardId
        });
    }
    static revealOneCard(socket, gameId, playerId, cardId) {
        socket.emit('player reveal card', {
            gameId, playerId, cardId
        });
    }
    static callCactus(socket, gameId, playerId) {
        socket.emit('call cactus', {
            gameId, playerId
        });
    }
    static restartGame(socket, gameId) {
        socket.emit('restart game', {
            gameId
        });
    }
}
exports.CactusSocketApi = CactusSocketApi;
