import { Socket, Server } from "socket.io";
import { Card } from "../interfaces/CardInterface";

export class SocketApi {

    static listenEvents(socket: Socket, callback: (eventType: string, data: any) => void) {
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
        })
    }

    static sendPlayerWaitingsList(socket: Server, roomId: string, data: any): void {
        SocketApi.sendMessage(socket, roomId, 'players waitings', data);
    }

    static sendGameStart(socket: Server, socketId: string, data: any): void {
        SocketApi.sendMessage(socket, socketId, 'start game', data);
    }

    static sendCardsValues(socket: Server, socketId: string, cards: {cardId: number, card: Card}[]): void {
        SocketApi.sendMessage(socket, socketId, 'cards revealed', cards);
    }

    // When all players revealed them cards
    static playersCanPlay(socket: Server, roomId: string): void {
        SocketApi.sendMessage(socket, roomId, 'players can start', {});
    }

    static playerIdCanPlay(socket: Server, playerId: string): void {
        SocketApi.sendMessage(socket, playerId, 'player can play', {});
    }

    static refreshTrash(socket: Server, roomId: string, card: Card): void {
        SocketApi.sendMessage(socket, roomId, 'refresh trash', card);
    }

    static drawedCard(socket: Server, socketId: string, card: Card): void {
        SocketApi.sendMessage(socket, socketId, 'drawed card', card);
    }

    static successTrashCard(socket: Server, socketId: string, cardId: number): void {
        SocketApi.sendMessage(socket, socketId, 'success trash middle game', cardId);
    }

    static playerCallCactus(socket: Server, roomId: string, playerId: number): void {
        SocketApi.sendMessage(socket, roomId, 'cactus called', playerId);
    }

    static playerRevealsCards(socket: Server, roomId: string, allPlayerCards: any): void {
        SocketApi.sendMessage(socket, roomId, 'reveals all cards', allPlayerCards);
    }

    static gameOver(socket: Server, roomId: string, winnerId: number): void {
        SocketApi.sendMessage(socket, roomId, 'game over', winnerId);
    }

    static restartGame(socket: Server, roomId: string) {
        SocketApi.sendMessage(socket, roomId, 'newGame', {});
    }

    static sendMessage(socket: Server, roomId: string, msg: string, data: any) {
        socket.to(roomId).emit(msg, data);
    }
}