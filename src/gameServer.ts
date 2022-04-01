import { Server, Socket } from "socket.io";
import { Game } from "./game";
import { SocketApi } from "./services/socket-api";

export class GameServer {
    private games: {[key: string]: Game} = {};
    private socketIoServer: Server = null;

    constructor(socketIoServer: Server) {
        this.socketIoServer = socketIoServer;
        this.socketIoServer.on('connection', (socket: Socket) => {
            console.log('connect', socket.id);
            SocketApi.listenEvents(socket, this.onSocketEvent.bind(this));
        });
    }

    onSocketEvent(eventType: string, data: any): void {
        switch(eventType) {
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

    createGame(): number {
        const gameId: number = Math.floor(Math.random() * 1000);
        this.games[gameId] = new Game(gameId, this.socketIoServer);
        return gameId;
    }

    startGame(gameId: number): void {
        this.games[gameId].startGame();
    }

    addPlayer(gameId: number, socketId: string, playerName: string): number {
        return this.games[gameId].addPlayer(socketId, playerName);
    }

    getSecretPlayerKey(gameId: number, playerId: number): string {
        return this.games[gameId].getSecretPlayerKey(playerId);
    }

    checkGameExist(gameId: number): boolean {
        return this.games[gameId] !== undefined;
    }

    checkPlayerExist(gameId: number, playerId: number): boolean {
        return this.games[gameId].checkPlayerExist(playerId);
    }

    deleteGame(gameId: number): void {
        this.games[gameId].delete();
        delete this.games[gameId];
    }
}