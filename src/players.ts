import { Card } from "./interfaces/CardInterface";
import {Md5} from 'ts-md5/dist/md5';

export class Player {
    private playerId: number;
    private playerName: string;
    private socketId: string;
    private playerSecretKey: string;
    private cards: Card[];
    private drawCardBuffer: Card = null;
    private cardsRevealed: boolean = false;

    constructor(playerId: number, socketId: string, playerName: string) {
        this.socketId = socketId;
        this.playerId = playerId;
        this.playerName = playerName;
        this.playerSecretKey = Md5.hashStr('cactus-player-2000' + this.playerId + Math.floor(Math.random()));
    }

    getCards(): Card[] {
        return this.cards;
    }

    getCardsValues(): number {
        return this.cards.map((card: Card) => {
            return card.value;
        }).reduce((sum, a) => sum + a, 0);
    }

    getCardById(cardId: number): Card {
        return this.cards[cardId];
    }

    getName(): string {
        return this.playerName;
    }

    getTwoFirstCards(): Card[] {
        return [
            this.cards[0],
            this.cards[1]
        ];
    }

    revealFirstCards(): Card[] {
        if (this.cardsRevealed) {
            return null;
        }
        this.cardsRevealed = true;
        return this.getTwoFirstCards();
    }

    getSocketId(): string {
        return this.socketId;
    }

    isDrawed(): boolean {
        return this.drawCardBuffer !== null;
    }

    setDraw(card: Card): void {
        this.drawCardBuffer = card;
    }

    getSecretKey(): string {
        return this.playerSecretKey;
    }

    getDraw(): Card {
        return this.drawCardBuffer;
    }

    cleanDraw(): void {
        this.drawCardBuffer = null;
    }

    addCard(card: Card): void {
        this.cards.unshift(card);
    }

    replaceCard(cardIndex: number, card: Card): Card {
        const oldCard: Card = this.cards[cardIndex];
        this.cards[cardIndex] = card;

        return oldCard;
    }

    reset(): void {
        this.cards = [];
        this.drawCardBuffer = null;
        this.cardsRevealed = false;
    }
}