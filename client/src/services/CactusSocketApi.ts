import { Socket } from "socket.io-client";
import { Card } from "../interfaces/CardInterface";

export class CactusSocketApi {
    static listenEvents(socket: Socket, callback: (eventType: string, data?: any) => void) {
        socket.on('cards revealed', (cards: {cardId: number, card: Card}[]) => {
            callback('cardsRevealed', cards);
        });

        socket.on('players can start', () => {
            callback('playersStart');
        });

        socket.on('player can play', () => {
            callback('playerPlay');
        });

        socket.on('refresh trash', (card: Card) => {
            callback('refreshTrash', card);
        });

        socket.on('drawed card', (card: Card) => {
            callback('drawedCard', card);
        });

        socket.on('success trash middle game', (cardId: number) => {
            callback('successTrash', cardId);
        });

        socket.on('cactus called', (playerId: number) => {
            callback('cactus', playerId);
        });

        socket.on('reveals all cards', (playerCards: {playerId: number, cards: Card[]}[]) => {
            callback('revelation', playerCards);
        });

        socket.on('game over', (winnerId: number) => {
            callback('gameOver', winnerId)
        });

        socket.on('new game', () => {
            callback('newGame');
        })
    }

    static startGame(socket, gameId, playerId) {
        socket.emit('start game reveal cards', {
            gameId, playerId
        });
    }

    static drawCard(socket, gameId, playerId, drawId: 'trash' | 'draw') {
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