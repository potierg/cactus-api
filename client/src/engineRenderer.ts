import * as PIXI from "pixi.js"
import { Card } from "./interfaces/CardInterface";
import { Textures } from "./services/Textures";

export class EngineRenderer {
    private app: PIXI.Application = null;
    private textures: Textures;
    private playerContainer: PIXI.Container = null;

    private containers: {[key: string]: PIXI.Container} = {};
    private cards: {[key: string]: PIXI.Sprite} = {};
    private draw: PIXI.Sprite = null;
    private message: PIXI.Text = null;

    private cardsCoords = [
        [0, 160],
        [120, 160],
        [0, 0],
        [120, 0]
    ]

    constructor() {
        this.textures = new Textures();
    }

    setApp(app: PIXI.Application) {
        this.app = app;
    }

    init() {
        const board = new PIXI.Sprite(this.textures.getById('boardGame'));
        board.x = 0;
        board.y = 0;
        board.width = 1280;
        board.height = 720;
        this.app.stage.addChild(board);
    }

    createPlayerCards(): {[key: string]: PIXI.Sprite} {
        this.containers['playerCards'] = new PIXI.Container();
        this.app.stage.addChild(this.containers['playerCards']);
        this.containers['playerCards'].x = this.app.screen.width / 2 - 45;
        this.containers['playerCards'].y = this.app.screen.height / 2 - 10;

        this.cards[0] = this.createPlayerCard(this.cardsCoords[0][0], this.cardsCoords[0][1]);
        this.cards[1] = this.createPlayerCard(this.cardsCoords[1][0], this.cardsCoords[1][1]);
        this.cards[2] = this.createPlayerCard(this.cardsCoords[2][0], this.cardsCoords[2][1]);
        this.cards[3] = this.createPlayerCard(this.cardsCoords[3][0], this.cardsCoords[3][1]);

        Object.keys(this.cards).forEach((cardId) => {
            this.containers['playerCards'].addChild(this.cards[cardId]);
        });

        this.containers['revealCards'] = new PIXI.Container;
        this.app.stage.addChild(this.containers['revealCards']);
        this.containers['revealCards'].x = this.app.screen.width / 2 - 45;
        this.containers['revealCards'].y = this.app.screen.height / 2 - 10;

        return this.cards;
    }

    updateCardTexture(textureId) {
        Object.keys(this.cards).forEach((cardId) => {
            this.cards[cardId].texture = this.textures.getById(textureId);
        });
    }

    createPlayerCard(x: number, y: number, texture = 'backCard'): PIXI.Sprite {
        const card = new PIXI.Sprite(this.textures.getById(texture));
        card.anchor.set(0.5);
        card.x = x;
        card.y = y;
        card.width = 110;
        card.height = 150;
        card.interactive = true;
        return card;
    }

    getValueCode(cardInfo: Card) {
        let cardValue: string = cardInfo.number.toString();
        if (+cardValue >= 11) {
            cardValue = ['J', 'Q', 'K'][+cardValue - 11];
        }
        return cardInfo.color + cardValue;
    }

    createCardWithValue = (x: number, y: number, cardInfo: Card): PIXI.Sprite => {
        return this.createPlayerCard(x, y, this.getValueCode(cardInfo));
    }

    createDrawedCard(): PIXI.Container {
        this.containers['drawed'] = new PIXI.Container();
        this.app.stage.addChild(this.containers['drawed']);
        this.containers['drawed'].x = 220;
        this.containers['drawed'].y = this.app.screen.height / 2 + 70;

        this.containers['drawed'].interactive = true;
        return this.containers['drawed'];
    }

    createMessage(): void {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff'], // gradient
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            lineJoin: 'round',
        });

        this.message = new PIXI.Text('', style);
        this.app.stage.addChild(this.message);
        this.message.x = 75;
        this.message.y = 50;
    }


    displayDrawCard(cardInfo: Card) {
        const card = new PIXI.Sprite(this.textures.getById(this.getValueCode(cardInfo)));
        card.anchor.set(0.5);
        card.x = 0;
        card.y = 0;
        card.width = 230;
        card.height = 310;

        this.containers['drawed'].addChild(card);
    }

    hideDraw() {
        this.containers['drawed'].visible = false;
    }

    cleanDrawCard() {
        if (this.containers['drawed'].children.length > 0) {
            this.containers['drawed'].removeChildAt(0);
        }    
    }

    updateDrawTexture(textureId) {
        (<PIXI.Sprite>this.containers['gameCards'].getChildAt(0)).texture = this.textures.getById(textureId);
    }

    createDrawAndTrash() {
        this.containers['gameCards'] = new PIXI.Container();
        this.app.stage.addChild(this.containers['gameCards']);
        this.containers['gameCards'].x = this.app.screen.width / 2 + 350;
        this.containers['gameCards'].y = this.app.screen.height / 2;

        this.draw = this.createPlayerCard(55, -15);
        this.containers['gameCards'].addChild(this.draw);

        this.containers['trash'] = new PIXI.Container();
        this.app.stage.addChild(this.containers['trash']);
        this.containers['trash'].x = this.app.screen.width / 2 + 350;
        this.containers['trash'].y = this.app.screen.height / 2 + 85;

        this.displayTrash();
        this.containers['trash'].interactive = true;
        return {
            draw: this.draw,
            trash: this.containers.trash
        }
    }

    createCactusBtn(): PIXI.Sprite {
        this.containers['cactusBtn'] = new PIXI.Container();
        this.app.stage.addChild(this.containers['cactusBtn']);
        this.containers['cactusBtn'].x = this.app.screen.width - 250;
        this.containers['cactusBtn'].y = 50;

        const button = new PIXI.Sprite(this.textures.getById('cactusBtn'));
        button.x = 0;
        button.y = 0;
        button.width = 150;
        button.height = 150;
        button.interactive = true;

        this.containers['cactusBtn'].addChild(button);
        return button;
    }

    hideCactusBtn() {
        this.containers['cactusBtn'].visible = false;
    }

    displayTrash(card: Card = null) {
        this.containers['trash'].removeChildren(0, 2);
        if (card) {
            const trash = this.createCardWithValue(55, 75, card);
            this.containers['trash'].addChild(trash);
        }
    }

    displayMessage(message: string) {
        this.message.text = message;
    }

    hideMessage() {
        this.message.text = '';
    }

    hideCard(cardId) {
        this.cards[cardId].visible = false;
    }

    createRevealButton(): PIXI.Container {
        this.containers['revealBtn'] = new PIXI.Container();
        this.app.stage.addChild(this.containers['revealBtn']);
        this.containers['revealBtn'].interactive = true;

        this.containers['revealBtn'].x = this.app.screen.width / 2 - 100;
        this.containers['revealBtn'].y = this.app.screen.height / 2 + 250;

        const button = new PIXI.Sprite(this.textures.getById('revealBtn'));
        button.x = 0;
        button.y = 0;
        button.width = 230;
        button.height = 80;
        this.containers['revealBtn'].addChild(button);

        return this.containers['revealBtn'];
    }

    showRevealButton() {
        this.containers['revealBtn'].removeChildren(0, 2);
    }

    hideRevealButton() {
        this.containers['revealBtn'].removeChildren(0, 2);
    }

    revealCards(cards: {cardId: number, card: Card}[]) {

        cards.forEach((cardInfo: {cardId: number, card: Card}) => {
            const cardSprite = this.createCardWithValue(
                this.cardsCoords[cardInfo.cardId][0],
                this.cardsCoords[cardInfo.cardId][1],
                cardInfo.card
            );
            this.containers['revealCards'].addChild(cardSprite);
        });
    }

    hideRevealed() {
        this.containers['revealCards'].removeChildren(0, 2);
    }

    buildRestartButton(): PIXI.Sprite {
        this.containers['restartButton'] = new PIXI.Container();
        this.app.stage.addChild(this.containers['restartButton']);
        this.containers['restartButton'].x = this.app.screen.width - 650;
        this.containers['restartButton'].y = 20;

        const button = new PIXI.Sprite(this.textures.getById('startNewGameButton'));
        button.x = 0;
        button.y = 0;
        button.width = 600;
        button.height = 228;
        button.interactive = true;
        this.containers['restartButton'].addChild(button);
        this.containers['restartButton'].visible = false;

        return button;
    }

    resetCards() {
        for (let i = 0; i < 4; i++) {
            this.cards[i].visible = true;
        }
    }

    showRestartButton() {
        this.containers['restartButton'].visible = true;
    }

    hideRestartButton() {
        this.containers['restartButton'].visible = true;
    }
}