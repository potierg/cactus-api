"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const md5_1 = require("ts-md5/dist/md5");
class Player {
    constructor(playerId, socketId, playerName) {
        this.drawCardBuffer = null;
        this.cardsRevealed = false;
        this.socketId = socketId;
        this.playerId = playerId;
        this.playerName = playerName;
        this.playerSecretKey = md5_1.Md5.hashStr('cactus-player-2000' + this.playerId + Math.floor(Math.random()));
    }
    getCards() {
        return this.cards;
    }
    getCardsValues() {
        return this.cards.map((card) => {
            return card.value;
        }).reduce((sum, a) => sum + a, 0);
    }
    getCardById(cardId) {
        return this.cards[cardId];
    }
    getName() {
        return this.playerName;
    }
    getTwoFirstCards() {
        return [
            this.cards[0],
            this.cards[1]
        ];
    }
    revealFirstCards() {
        if (this.cardsRevealed) {
            return null;
        }
        this.cardsRevealed = true;
        return this.getTwoFirstCards();
    }
    getSocketId() {
        return this.socketId;
    }
    isDrawed() {
        return this.drawCardBuffer !== null;
    }
    setDraw(card) {
        this.drawCardBuffer = card;
    }
    getSecretKey() {
        return this.playerSecretKey;
    }
    getDraw() {
        return this.drawCardBuffer;
    }
    cleanDraw() {
        this.drawCardBuffer = null;
    }
    addCard(card) {
        this.cards.unshift(card);
    }
    replaceCard(cardIndex, card) {
        const oldCard = this.cards[cardIndex];
        this.cards[cardIndex] = card;
        return oldCard;
    }
    reset() {
        this.cards = [];
        this.drawCardBuffer = null;
        this.cardsRevealed = false;
    }
}
exports.Player = Player;
//# sourceMappingURL=players.js.map