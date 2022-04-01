import * as PIXI from "pixi.js"

import config from '../environment/environment.json';

export class JoinPage {
    private app: PIXI.Application;
    private backgroundTexture: PIXI.Texture;
    private background: PIXI.Sprite;

    private gameId: PIXI.Text;
    private joinButtonTexture: PIXI.Texture;

    private linkString: string;
    private joinButton: PIXI.Sprite;
    private linkStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#000000'], // gradient
        lineJoin: 'round',
    });
    private eventListeners = {};

    private joinPageCallback: (string) => void;

    constructor (app: PIXI.Application) {
        this.app = app;
        this.backgroundTexture = PIXI.Texture.from('img/newGame/background-join-game.jpg');
        this.joinButtonTexture = PIXI.Texture.from('img/newGame/joinButton.png');
    }

    private displayBackground() {
        this.background = new PIXI.Sprite(this.backgroundTexture);
        this.background.x = 0;
        this.background.y = 0;
        this.background.width = this.app.screen.width;
        this.background.height = this.app.screen.height;
        this.app.stage.addChild(this.background);
    }

    private displayLink(gameId: number) {
        this.linkString = `${config.hostUrl}?game=${gameId}`;
        document.getElementById('gameLink').hidden = false;
        (<HTMLInputElement>document.getElementById('gameLink')).value = this.linkString;
    }

    private displayGameId(gameId: number) {
        this.gameId = new PIXI.Text(gameId + '', this.linkStyle);
        this.app.stage.addChild(this.gameId);
        this.gameId.x = 780;
        this.gameId.y = 150;
    }

    private displayInput() {
        document.getElementById('playerNameInput').hidden = false;
    }

    private buildButton() {
        this.joinButton = new PIXI.Sprite(this.joinButtonTexture);
        this.joinButton.x = 525;
        this.joinButton.y = 550;
        this.joinButton.width = 164;
        this.joinButton.height = 33;
        this.joinButton.interactive = true;
        this.joinButton.visible = false;
        this.app.stage.addChild(this.joinButton);

        this.joinButton.on('pointerdown', () => {
            this.joinPageCallback((<HTMLInputElement>document.getElementById('playerNameInput')).value);
        });
    }

    private showJoinButton() {
        this.joinButton.visible = true;
    }

    private hideJoinButton() {
        this.joinButton.visible = false;
    }

    setCallback(joinPageCallback: (string) => void) {
        this.joinPageCallback = joinPageCallback;
    }

    display(gameId) {
        this.displayBackground();
        this.displayGameId(gameId);
        this.displayLink(gameId);
        this.displayInput();
        this.buildButton();

        this.eventListeners['input'] = () => {
            if ((<HTMLInputElement>document.getElementById('playerNameInput')).value.length >= 1) {
                this.showJoinButton();
            } else {
                this.hideJoinButton();
            }
        };
        this.eventListeners['change'] = () => {
            this.joinPageCallback((<HTMLInputElement>document.getElementById('playerNameInput')).value);
        };

        document.getElementById('playerNameInput').addEventListener('input', this.eventListeners['input']);
        document.getElementById('playerNameInput').addEventListener('change', this.eventListeners['change']);
    }

    destroyPage() {
        this.gameId.visible = false;
        document.getElementById('gameLink').hidden = true;
        this.joinButton.visible = false;
        document.getElementById('playerNameInput').hidden = true;
        document.getElementById('playerNameInput').removeEventListener('input', this.eventListeners['input']);
        document.getElementById('playerNameInput').removeEventListener('change', this.eventListeners['change']);
    }
}