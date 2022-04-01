"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayersListPage = void 0;
const PIXI = __importStar(require("pixi.js"));
class PlayersListPage {
    constructor(app) {
        this.linkStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#000000'],
            lineJoin: 'round',
        });
        this.playerName = '';
        this.app = app;
        this.backgroundTexture = PIXI.Texture.from('img/newGame/background-start-game.jpg');
        this.joinButtonTexture = PIXI.Texture.from('img/newGame/startButton.png');
    }
    displayBackground() {
        this.background = new PIXI.Sprite(this.backgroundTexture);
        this.background.x = 0;
        this.background.y = 0;
        this.background.width = this.app.screen.width;
        this.background.height = this.app.screen.height;
        this.app.stage.addChild(this.background);
    }
    displayLink(gameId) {
        this.linkString = 'http://192.168.1.61:3000?game=' + gameId;
        this.link = new PIXI.Text(this.linkString, this.linkStyle);
        this.app.stage.addChild(this.link);
        this.link.x = 210;
        this.link.y = 285;
    }
    displayGameId(gameId) {
        this.gameId = new PIXI.Text(gameId + '', this.linkStyle);
        this.app.stage.addChild(this.gameId);
        this.gameId.x = 780;
        this.gameId.y = 150;
    }
    displayInput() {
        this.placeholder = new PIXI.Text('Player Name...', this.linkStyle);
        this.app.stage.addChild(this.placeholder);
        this.placeholder.x = 265;
        this.placeholder.y = 435;
        this.playerNameText = new PIXI.Text(this.playerName, this.linkStyle);
        this.app.stage.addChild(this.playerNameText);
        this.playerNameText.x = 265;
        this.playerNameText.y = 435;
    }
    showPlaceholder() {
        this.placeholder.visible = true;
    }
    hidePlaceholder() {
        this.placeholder.visible = false;
    }
    refreshPlayerName() {
        this.playerNameText.text = this.playerName;
        if (this.playerName === '') {
            this.showPlaceholder();
            this.hideJoinButton();
        }
        else {
            this.hidePlaceholder();
            this.showJoinButton();
        }
    }
    buildButton() {
        this.joinButton = new PIXI.Sprite(this.joinButtonTexture);
        this.joinButton.x = 525;
        this.joinButton.y = 550;
        this.joinButton.width = 164;
        this.joinButton.height = 33;
        this.joinButton.interactive = true;
        this.joinButton.visible = false;
        this.app.stage.addChild(this.joinButton);
        this.joinButton.on('click', () => {
            this.joinPageCallback(this.playerName);
        });
    }
    showJoinButton() {
        this.joinButton.visible = true;
    }
    hideJoinButton() {
        this.joinButton.visible = false;
    }
    setCallback(joinPageCallback) {
        this.joinPageCallback = joinPageCallback;
    }
    display(gameId) {
        this.displayBackground();
        this.displayGameId(gameId);
        this.displayLink(gameId);
        this.displayInput();
        this.buildButton();
        this.keyboardListener = (e) => {
            if (e.keyCode >= 65 && e.keyCode <= 90 && this.playerName.length < 20) {
                this.playerName += String.fromCharCode(e.keyCode);
                this.refreshPlayerName();
            }
            if (e.keyCode === 32) {
                this.playerName += ' ';
                this.refreshPlayerName();
            }
            if (e.keyCode === 13 && this.playerName.length) {
                this.joinPageCallback(this.playerName);
            }
            if (e.keyCode === 8) {
                if (this.playerName.length === 1) {
                    this.playerName = '';
                }
                else {
                    this.playerName = this.playerName.substring(0, this.playerName.length - 1);
                }
                this.refreshPlayerName();
            }
            console.log(e.keyCode);
        };
        window.addEventListener('keydown', this.keyboardListener);
    }
    destroyPage() {
        window.removeEventListener('keydown', this.keyboardListener);
        this.background.destroy();
        this.gameId.destroy();
        this.link.destroy();
        this.joinButton.destroy();
        this.placeholder.destroy();
        this.playerNameText.destroy();
    }
}
exports.PlayersListPage = PlayersListPage;
