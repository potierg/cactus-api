import * as PIXI from "pixi.js"
import { EngineRenderer } from "./engineRenderer";
import { Card } from "./interfaces/CardInterface";

export class GameRenderer {
    private app: PIXI.Application = null;
    private clickedCallback;
    private engineRenderer: EngineRenderer;

    private enableItems = {
        trash: false,
        draw: false,
        cards: false
    }

    constructor(app: PIXI.Application) {
        this.app = app;
    }

    setClickCallback(callback) {
        this.clickedCallback = callback;
    }

    getApp(): PIXI.Application {
        return this.app;
    }

    buildBoard() {
        this.engineRenderer = new EngineRenderer();
        this.engineRenderer.setApp(this.app);
        this.engineRenderer.init();

        const cards: {[key: string]: PIXI.Sprite} = this.engineRenderer.createPlayerCards();

        Object.keys(cards).forEach((cardId) => {
            cards[cardId].on('pointerdown', () => {
                if (this.enableItems['cards']) {
                    this.clickedCallback(cardId);
                }
            });
        });

        const gameCards = this.engineRenderer.createDrawAndTrash();

        this.engineRenderer.createCactusBtn().on('pointerdown', () => {
            this.clickedCallback('cactus');
        });

        gameCards.draw.on('pointerdown', () => {
            if (this.enableItems['draw']) {
                this.clickedCallback('draw');
            }
        });

        gameCards.trash.on('pointerdown', () => {
            if (this.enableItems['trash']) {
                this.clickedCallback('trash');
            }
        });

        this.engineRenderer.createRevealButton().on('pointerdown', (e) => {
            this.clickedCallback('reveal');
        });

        this.engineRenderer.createDrawedCard().on('pointerdown', () => {
            this.clickedCallback('drawCard');
        });

        this.engineRenderer.createMessage();
        this.engineRenderer.buildRestartButton().on('pointerdown', () => {
            this.clickedCallback('restartGame');
        });
    }

    hideCactusBtn() {
        this.engineRenderer.hideCactusBtn();
    }

    showRevealed(cards: {cardId: number, card: Card}[]) {
        this.engineRenderer.revealCards(cards);
    }

    hideRevealed() {
        this.engineRenderer.hideRevealed();
    }

    showRevealButton() {
        this.engineRenderer.showRevealButton();
    }

    hideRevealButton() {
        this.engineRenderer.hideRevealButton();
    }

    showDrawCard(card: Card) {
        this.engineRenderer.displayDrawCard(card);
    }

    showEyeCards() {
        this.engineRenderer.updateCardTexture('backCardEye');
    }

    hideEyeCards() {
        this.engineRenderer.updateCardTexture('backCardGreen');
    }

    hideDraw() {
        this.engineRenderer.hideDraw();
    }

    cleanDrawCard() {
        this.engineRenderer.cleanDrawCard();
    }

    displayTrash(card: Card = null) {
        this.engineRenderer.displayTrash(card);
    }

    displayMessage(message: string) {
        this.engineRenderer.displayMessage(message);
    }

    hideMessage() {
        this.engineRenderer.hideMessage();
    }

    hideCard(cardId) {
        this.engineRenderer.hideCard(cardId);
    }

    setActiveCards(state) {
        this.engineRenderer.updateCardTexture(state ? 'backCardGreen' : 'backCard');
    }

    setActiveDraw(state) {
        this.engineRenderer.updateDrawTexture(state ? 'backCardGreen' : 'backCard');
    }

    setInteraction(id, state) {
        this.enableItems[id] = state;
    }

    setTrashInteraction(state) {
        this.setInteraction('trash', state);
    }

    setDrawInteraction(state) {
        this.setInteraction('draw', state);
    }

    setCardsInteraction(state) {
        this.setInteraction('cards', state);
    }

    resetCards() {
        this.engineRenderer.resetCards();
    }

    showRestartButton() {
        this.engineRenderer.showRestartButton();
    }

    hideRestartButton() {
        this.engineRenderer.hideRestartButton();
    }
}