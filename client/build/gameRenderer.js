"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRenderer = void 0;
const engineRenderer_1 = require("./engineRenderer");
class GameRenderer {
    constructor(app) {
        this.app = null;
        this.enableItems = {
            trash: false,
            draw: false,
            cards: false
        };
        this.app = app;
    }
    setClickCallback(callback) {
        this.clickedCallback = callback;
    }
    getApp() {
        return this.app;
    }
    buildBoard() {
        this.engineRenderer = new engineRenderer_1.EngineRenderer();
        this.engineRenderer.setApp(this.app);
        this.engineRenderer.init();
        const cards = this.engineRenderer.createPlayerCards();
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
    showRevealed(cards) {
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
    showDrawCard(card) {
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
    displayTrash(card = null) {
        this.engineRenderer.displayTrash(card);
    }
    displayMessage(message) {
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
exports.GameRenderer = GameRenderer;
