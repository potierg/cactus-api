import { Card } from "./interfaces/CardInterface";
import { Player } from "./players";
import { Server } from "socket.io";
import { SocketApi } from "./services/socket-api";
import { Cards } from "./utils/cards";

export class Game {
    private socketIoServer: Server = null;
    private roomId: string = null;

    private gameId: number;
    private playerSockets: {[key:string]: string} = {};
    private players: {[key: string]: Player} = {};
    private trash: Card[];
    private draw: Card[];
    private cactusPlayerId: number = null;
    private countPlayerRevealed: number = 0;
    private playerIndex = 0;

    constructor(gameId: number, socketIoServer: Server) {
        this.gameId = gameId;
        this.socketIoServer = socketIoServer;
        this.roomId = 'game-' + this.gameId;
    }

    private getPlayers() {
        return Object.keys(this.players).map((playerId) => {
            return {
                id: playerId,
                name: this.players[playerId].getName()
            }
        })
    }

    // Add player in game, generate player ID and refresh player List
    addPlayer(socketId: string, playerName: string): number {
        const playerId: number = Math.floor(Math.random() * 100);
        this.players[playerId] = new Player(playerId, socketId, playerName);
        this.playerSockets[playerId] = socketId;
        this.socketIoServer.to(socketId).socketsJoin(this.roomId);

        SocketApi.sendPlayerWaitingsList(this.socketIoServer, this.roomId, {
            players: this.getPlayers()
        });

        return playerId;
    }

    startGame(): void {
        const playerIds = Object.keys(this.players);

        // Reset Game & Players
        this.reset();
        playerIds.forEach((playerId: string) => {
            this.players[playerId].reset();
        });

        // Create Draw and draw cards to players
        this.draw = Cards.createDraw();
        this.drawCardsToPlayers();

        const players = this.getPlayers();

        // Send the game informations to players
        let firstPlayer = true;
        playerIds.forEach((playerId: string) => {
            const socketId = this.players[playerId].getSocketId();

            SocketApi.sendGameStart(this.socketIoServer, socketId, {
                firstToPlay: firstPlayer,
                playerNumber: players.length,
                players,
            });
            firstPlayer = false;
        });
    }

    // Send the value of 2 first cards to player
    revealTwoFirstCards(playerId: number): void {
        const firstCards = this.players[playerId].revealFirstCards();
        const socketId = this.playerSockets[playerId];

        SocketApi.sendCardsValues(this.socketIoServer, socketId, [
                {cardId: 0, card: firstCards[0]},
                {cardId: 1, card: firstCards[1]}
            ]
        );

        if (firstCards) {
            this.countPlayerRevealed++;
        }
        // If all players revealed, game can start
        if (this.countPlayerRevealed === Object.keys(this.players).length) {
            SocketApi.playersCanPlay(this.socketIoServer, this.roomId);
        }
        const playerIds = Object.keys(this.players);
        SocketApi.playerIdCanPlay(this.socketIoServer, this.players[playerIds[this.playerIndex]].getSocketId());
    }

    // Draw cards to all players
    drawCardsToPlayers(): void {
        const playerIds = Object.keys(this.players);
        for (let i = 0; i < 4; i++) {
            playerIds.forEach((playerId: string) => {
                this.players[playerId].addCard(this.draw.pop());
            });
        }
    }

    // Player draw card from draw of trash
    drawCard(playerId: number, drawId: 'trash' | 'draw'): Card {
        const socketId = this.players[playerId].getSocketId();
        let card: Card = null;

        if (this.players[playerId].isDrawed()) {
            return null;
        }

        switch (drawId) {
            case 'trash':
                card = this.trash.pop();
                SocketApi.refreshTrash(this.socketIoServer, this.roomId, this.trash.length > 0 ? this.trash[this.trash.length - 1] : null);
                break;
            case 'draw':
                card = this.draw.pop();
                break;
        }
        SocketApi.drawedCard(this.socketIoServer, socketId, card);
        this.players[playerId].setDraw(card);
        return card;
    }

    // Player choose a card to trash, the draw card or one of them
    trashCard(playerId: number, trashId: string): void {
        let card: Card = this.players[playerId].getDraw();
        if (trashId === 'drawCard') {
            this.trash.push(card);
        } else {
            const oldCard: Card = this.players[playerId].replaceCard(+trashId, card);
            this.trash.push(oldCard);
            card = oldCard;
        }
        this.players[playerId].cleanDraw();

        this.afterTrash(playerId, card);
    }

    // Refresh trash for all players & prepare next turn
    afterTrash(playerId: number, card: Card): void {
        SocketApi.refreshTrash(this.socketIoServer, this.roomId, card);
        const playersIds = Object.keys(this.players);
        this.playerIndex += 1;
        this.playerIndex %= playersIds.length;
        this.players[playerId].setDraw(null);
        this.nextTurn();
    }

    // If player call cactus, it's the last turn, else continue playing
    nextTurn(): void {
        const playersIds = Object.keys(this.players);
        if (this.cactusPlayerId !== null && +playersIds[this.playerIndex] === this.cactusPlayerId) {

            const allCards = playersIds.map((playerId) => {
                return {
                    playerId,
                    cards: this.players[playerId].getCards().filter((card: Card) => {
                        return card.color !== 'W';
                    })
                }
            });

            SocketApi.playerRevealsCards(this.socketIoServer, this.roomId, allCards);
            this.endGame();
        } else {
            const playerId = playersIds[this.playerIndex];
            SocketApi.playerIdCanPlay(this.socketIoServer, this.playerSockets[playerId]);
        }
    }

    // Player can trash one of his card if the value equal the last trash card
    trashCardInMiddleGame(playerId: number, trashId: number): void {
        const selectedCard: Card = Object.assign({}, this.players[playerId].getCards()[+trashId]);
        const lastTrash: Card = this.trash[this.trash.length - 1];

        if (selectedCard.value === lastTrash.value) {
            this.trash.push(selectedCard);
            this.players[playerId].getCards()[+trashId].color = 'W';
            this.players[playerId].getCards()[+trashId].number = 0;
            this.players[playerId].getCards()[+trashId].value = 0;
            this.sendMessageTrashCompare(playerId, trashId, true);
        } else {
            this.trash.push(selectedCard);
            const newCard: Card = Object.assign({}, this.draw.pop());
            this.players[playerId].getCards()[+trashId] = newCard;
            this.sendMessageTrashCompare(playerId, trashId, false);
        }
    }

    // Send message for valid on unvalid trash
    sendMessageTrashCompare(playerId: number, cardId: number, actionIsValid = false): void {
        const socketId = this.players[playerId].getSocketId();

        if (actionIsValid) {
            SocketApi.successTrashCard(this.socketIoServer, socketId, cardId);
        }
        SocketApi.refreshTrash(this.socketIoServer, this.roomId, this.trash[this.trash.length - 1]);
    }

    // If Player pick an 8, he can reveal the card he want
    revealSpecificCard(playerId: number, cardId: number): void {
        if (this.players[playerId].getDraw().number === 8) {
            SocketApi.sendCardsValues(this.socketIoServer, this.playerSockets[playerId], [{
                cardId,
                card: this.players[playerId].getCardById(cardId)
            }]);
        }
    }

    // Player call cactus and game enter his last turn
    callCactus(playerId: number): void {
        this.cactusPlayerId = playerId;
        SocketApi.playerCallCactus(this.socketIoServer, this.roomId, playerId);
    }

    // Game Over, get winner and send his id
    endGame(): void {
        // Calcul Winner

        let minTotal = -1;
        let winnnerId: number = null;
        Object.keys(this.players).forEach((playerId: string) => {
            const total = this.players[playerId].getCardsValues();
            if (winnnerId === null || minTotal > total) {
                winnnerId = +playerId;
                minTotal = total;
            }
        });
        if (minTotal > 5) {
            winnnerId = null;
        }
        SocketApi.gameOver(this.socketIoServer, this.roomId, winnnerId);
    }

    checkPlayerExist(playerId: number): boolean {
        return this.players[playerId] !== undefined;
    }

    getSecretPlayerKey(playerId: number): string {
        return this.players[playerId].getSecretKey();
    }

    reset(): void {
        const playerIds = Object.keys(this.players);
        playerIds.forEach((playerId: string) => {
            this.players[playerId].reset();
        });
        this.trash = [];
        this.draw = [];
        this.cactusPlayerId = null;
        this.countPlayerRevealed = 0;
        SocketApi.restartGame(this.socketIoServer, this.roomId);
    }

    delete(): void {
        const playerIds = Object.keys(this.players);
        playerIds.forEach((playerId: string) => {
            delete this.players[playerId];
        });
        this.players = {};
        this.playerSockets = {};
        this.countPlayerRevealed = 0;
    }
}