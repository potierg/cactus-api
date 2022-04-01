import * as PIXI from "pixi.js"

export class HomePage {
    private app: PIXI.Application;
    private backgroundTexture: PIXI.Texture;
    private background: PIXI.Sprite;
    private buttonsContainer: PIXI.Container;
    private waitingMessage: PIXI.Text;
    private pointer: PIXI.Sprite;

    private homePageCallback: (string) => void;

    private textStyle = new PIXI.TextStyle({
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

    constructor (app: PIXI.Application) {
        this.app = app;
        this.backgroundTexture = PIXI.Texture.from('img/home/background.png');
    }

    displayBackground() {
        this.background = new PIXI.Sprite(this.backgroundTexture);
        this.background.x = 0;
        this.background.y = 0;
        this.background.width = this.app.screen.width;
        this.background.height = this.app.screen.height;
        this.app.stage.addChild(this.background);
    }

    private displayWaitingMessage() {
        this.waitingMessage = new PIXI.Text('Waiting for server...', this.textStyle);
        this.app.stage.addChild(this.waitingMessage);
        this.waitingMessage.x = this.background.width / 2 - 200;
        this.waitingMessage.y = this.background.height / 2;
    }

    private displayMenu() {
        const createGameButtonTexture = PIXI.Texture.from('img/home/newGameButton.png');
        const joinGameButtonTexture = PIXI.Texture.from('img/home/joinGameButton.png');
        const pointerTexture = PIXI.Texture.from('img/home/pointer.png');

        this.buttonsContainer = new PIXI.Container();
        this.app.stage.addChild(this.buttonsContainer);
        this.buttonsContainer.x = this.background.width / 2 - 200;
        this.buttonsContainer.y = this.background.height / 2 - 50;

        this.pointer = new PIXI.Sprite(pointerTexture);
        this.app.stage.addChild(this.pointer);
        this.pointer.visible = false;

        const createGameButton = this.createGameButton(createGameButtonTexture, 0, 0);
        createGameButton.on('pointerover', () => {
            this.pointer.visible = true;
            this.pointer.x = this.background.width / 2 - 270;
            this.pointer.y = this.background.height / 2 - 35;
        });
        createGameButton.on('pointerout', () => {
            this.pointer.visible = false;
        });
        createGameButton.on('click', () => {
            this.homePageCallback('createGame');
        });

        /*const joinGameButton = this.createGameButton(joinGameButtonTexture, 0, 100);
        joinGameButton.on('pointerover', () => {
            this.pointer.visible = true;
            this.pointer.x = this.background.width / 2 - 270;
            this.pointer.y = this.background.height / 2 + 75;
        });
        joinGameButton.on('pointerout', () => {
            this.pointer.visible = false;
        });*/

        this.buttonsContainer.addChild(createGameButton);
        //this.buttonsContainer.addChild(joinGameButton);
    }

    private createGameButton(texture: PIXI.Texture, positionX: number, positionY: number): PIXI.Sprite {
        const button = new PIXI.Sprite(texture);
        button.x = positionX;
        button.y = positionY;
        button.width = 370;
        button.height = 140;
        button.interactive = true;
        return button;
    }

    private hideWaitingMsg() {
        this.waitingMessage.visible = false;
    }

    setCallback(homePageCallback: (string) => void) {
        this.homePageCallback = homePageCallback;
    }

    displayWaiting() {
        this.displayWaitingMessage();
    }

    hideWaiting() {
        this.hideWaitingMsg();
    }

    destroyBackground() {
        this.background.destroy();
    }

    displayHomePage() {
        this.hideWaitingMsg();
        this.displayMenu();
    }

    destroyPage() {
        this.buttonsContainer.children.forEach((child) => {
            child.removeListener('pointerout');
            child.removeListener('pointerhover');
            child.removeListener('click');
            child.destroy();
        });
        this.buttonsContainer.destroy();
        this.pointer.destroy();
        this.background.destroy();
    }
}