"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const players_1 = require("./players");
const socket_api_1 = require("./services/socket-api");
const cards_1 = require("./utils/cards");
class Game {
    constructor(gameId, socketIoServer) {
        this.socketIoServer = null;
        this.roomId = null;
        this.playerSockets = {};
        this.players = {};
        this.cactusPlayerId = null;
        this.countPlayerRevealed = 0;
        this.playerIndex = 0;
        this.gameId = gameId;
        this.socketIoServer = socketIoServer;
        this.roomId = 'game-' + this.gameId;
    }
    getPlayers() {
        return Object.keys(this.players).map((playerId) => {
            return {
                id: playerId,
                name: this.players[playerId].getName()
            };
        });
    }
    // Add player in game, generate player ID and refresh player List
    addPlayer(socketId, playerName) {
        const playerId = Math.floor(Math.random() * 100);
        this.players[playerId] = new players_1.Player(playerId, socketId, playerName);
        this.playerSockets[playerId] = socketId;
        this.socketIoServer.to(socketId).socketsJoin(this.roomId);
        socket_api_1.SocketApi.sendPlayerWaitingsList(this.socketIoServer, this.roomId, {
            players: this.getPlayers()
        });
        return playerId;
    }
    startGame() {
        const playerIds = Object.keys(this.players);
        // Reset Game & Players
        this.reset();
        playerIds.forEach((playerId) => {
            this.players[playerId].reset();
        });
        // Create Draw and draw cards to players
        this.draw = cards_1.Cards.createDraw();
        this.drawCardsToPlayers();
        const players = this.getPlayers();
        // Send the game informations to players
        let firstPlayer = true;
        playerIds.forEach((playerId) => {
            const socketId = this.players[playerId].getSocketId();
            socket_api_1.SocketApi.sendGameStart(this.socketIoServer, socketId, {
                firstToPlay: firstPlayer,
                playerNumber: players.length,
                players,
            });
            firstPlayer = false;
        });
    }
    // Send the value of 2 first cards to player
    revealTwoFirstCards(playerId) {
        const firstCards = this.players[playerId].revealFirstCards();
        const socketId = this.playerSockets[playerId];
        socket_api_1.SocketApi.sendCardsValues(this.socketIoServer, socketId, [
            { cardId: 0, card: firstCards[0] },
            { cardId: 1, card: firstCards[1] }
        ]);
        if (firstCards) {
            this.countPlayerRevealed++;
        }
        // If all players revealed, game can start
        if (this.countPlayerRevealed === Object.keys(this.players).length) {
            socket_api_1.SocketApi.playersCanPlay(this.socketIoServer, this.roomId);
        }
        const playerIds = Object.keys(this.players);
        socket_api_1.SocketApi.playerIdCanPlay(this.socketIoServer, this.players[playerIds[this.playerIndex]].getSocketId());
    }
    // Draw cards to all players
    drawCardsToPlayers() {
        const playerIds = Object.keys(this.players);
        for (let i = 0; i < 4; i++) {
            playerIds.forEach((playerId) => {
                this.players[playerId].addCard(this.draw.pop());
            });
        }
    }
    // Player draw card from draw of trash
    drawCard(playerId, drawId) {
        const socketId = this.players[playerId].getSocketId();
        let card = null;
        if (this.players[playerId].isDrawed()) {
            return null;
        }
        switch (drawId) {
            case 'trash':
                card = this.trash.pop();
                socket_api_1.SocketApi.refreshTrash(this.socketIoServer, this.roomId, this.trash.length > 0 ? this.trash[this.trash.length - 1] : null);
                break;
            case 'draw':
                card = this.draw.pop();
                break;
        }
        socket_api_1.SocketApi.drawedCard(this.socketIoServer, socketId, card);
        this.players[playerId].setDraw(card);
        return card;
    }
    // Player choose a card to trash, the draw card or one of them
    trashCard(playerId, trashId) {
        let card = this.players[playerId].getDraw();
        if (trashId === 'drawCard') {
            this.trash.push(card);
        }
        else {
            const oldCard = this.players[playerId].replaceCard(+trashId, card);
            this.trash.push(oldCard);
            card = oldCard;
        }
        this.players[playerId].cleanDraw();
        this.afterTrash(playerId, card);
    }
    // Refresh trash for all players & prepare next turn
    afterTrash(playerId, card) {
        socket_api_1.SocketApi.refreshTrash(this.socketIoServer, this.roomId, card);
        const playersIds = Object.keys(this.players);
        this.playerIndex += 1;
        this.playerIndex %= playersIds.length;
        this.players[playerId].setDraw(null);
        this.nextTurn();
    }
    // If player call cactus, it's the last turn, else continue playing
    nextTurn() {
        const playersIds = Object.keys(this.players);
        if (this.cactusPlayerId !== null && +playersIds[this.playerIndex] === this.cactusPlayerId) {
            const allCards = playersIds.map((playerId) => {
                return {
                    playerId,
                    cards: this.players[playerId].getCards().filter((card) => {
                        return card.color !== 'W';
                    })
                };
            });
            socket_api_1.SocketApi.playerRevealsCards(this.socketIoServer, this.roomId, allCards);
            this.endGame();
        }
        else {
            const playerId = playersIds[this.playerIndex];
            socket_api_1.SocketApi.playerIdCanPlay(this.socketIoServer, this.playerSockets[playerId]);
        }
    }
    // Player can trash one of his card if the value equal the last trash card
    trashCardInMiddleGame(playerId, trashId) {
        const selectedCard = Object.assign({}, this.players[playerId].getCards()[+trashId]);
        const lastTrash = this.trash[this.trash.length - 1];
        if (selectedCard.value === lastTrash.value) {
            this.trash.push(selectedCard);
            this.players[playerId].getCards()[+trashId].color = 'W';
            this.players[playerId].getCards()[+trashId].number = 0;
            this.players[playerId].getCards()[+trashId].value = 0;
            this.sendMessageTrashCompare(playerId, trashId, true);
        }
        else {
            this.trash.push(selectedCard);
            const newCard = Object.assign({}, this.draw.pop());
            this.players[playerId].getCards()[+trashId] = newCard;
            this.sendMessageTrashCompare(playerId, trashId, false);
        }
    }
    // Send message for valid on unvalid trash
    sendMessageTrashCompare(playerId, cardId, actionIsValid = false) {
        const socketId = this.players[playerId].getSocketId();
        if (actionIsValid) {
            socket_api_1.SocketApi.successTrashCard(this.socketIoServer, socketId, cardId);
        }
        socket_api_1.SocketApi.refreshTrash(this.socketIoServer, this.roomId, this.trash[this.trash.length - 1]);
    }
    // If Player pick an 8, he can reveal the card he want
    revealSpecificCard(playerId, cardId) {
        if (this.players[playerId].getDraw().number === 8) {
            socket_api_1.SocketApi.sendCardsValues(this.socketIoServer, this.playerSockets[playerId], [{
                    cardId,
                    card: this.players[playerId].getCardById(cardId)
                }]);
        }
    }
    // Player call cactus and game enter his last turn
    callCactus(playerId) {
        this.cactusPlayerId = playerId;
        socket_api_1.SocketApi.playerCallCactus(this.socketIoServer, this.roomId, playerId);
    }
    // Game Over, get winner and send his id
    endGame() {
        // Calcul Winner
        let minTotal = -1;
        let winnnerId = null;
        Object.keys(this.players).forEach((playerId) => {
            const total = this.players[playerId].getCardsValues();
            if (winnnerId === null || minTotal > total) {
                winnnerId = +playerId;
                minTotal = total;
            }
        });
        if (minTotal > 5) {
            winnnerId = null;
        }
        socket_api_1.SocketApi.gameOver(this.socketIoServer, this.roomId, winnnerId);
    }
    checkPlayerExist(playerId) {
        return this.players[playerId] !== undefined;
    }
    getSecretPlayerKey(playerId) {
        return this.players[playerId].getSecretKey();
    }
    reset() {
        const playerIds = Object.keys(this.players);
        playerIds.forEach((playerId) => {
            this.players[playerId].reset();
        });
        this.trash = [];
        this.draw = [];
        this.cactusPlayerId = null;
        this.countPlayerRevealed = 0;
        socket_api_1.SocketApi.restartGame(this.socketIoServer, this.roomId);
    }
    delete() {
        const playerIds = Object.keys(this.players);
        playerIds.forEach((playerId) => {
            delete this.players[playerId];
        });
        this.players = {};
        this.playerSockets = {};
        this.countPlayerRevealed = 0;
    }
}
exports.Game = Game;
//# sourceMappingURL=game.js.map