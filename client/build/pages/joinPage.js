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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinPage = void 0;
const PIXI = __importStar(require("pixi.js"));
const environment_json_1 = __importDefault(require("../environment/environment.json"));
class JoinPage {
    constructor(app) {
        this.linkStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#000000'],
            lineJoin: 'round',
        });
        this.eventListeners = {};
        this.app = app;
        this.backgroundTexture = PIXI.Texture.from('img/newGame/background-join-game.jpg');
        this.joinButtonTexture = PIXI.Texture.from('img/newGame/joinButton.png');
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
        this.linkString = `${environment_json_1.default.hostUrl}?game=${gameId}`;
        document.getElementById('gameLink').hidden = false;
        document.getElementById('gameLink').value = this.linkString;
    }
    displayGameId(gameId) {
        this.gameId = new PIXI.Text(gameId + '', this.linkStyle);
        this.app.stage.addChild(this.gameId);
        this.gameId.x = 780;
        this.gameId.y = 150;
    }
    displayInput() {
        document.getElementById('playerNameInput').hidden = false;
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
        this.joinButton.on('pointerdown', () => {
            this.joinPageCallback(document.getElementById('playerNameInput').value);
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
        this.eventListeners['input'] = () => {
            if (document.getElementById('playerNameInput').value.length >= 1) {
                this.showJoinButton();
            }
            else {
                this.hideJoinButton();
            }
        };
        this.eventListeners['change'] = () => {
            this.joinPageCallback(document.getElementById('playerNameInput').value);
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
exports.JoinPage = JoinPage;
