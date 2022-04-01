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
exports.PlayersListPage = void 0;
const PIXI = __importStar(require("pixi.js"));
const environment_json_1 = __importDefault(require("../environment/environment.json"));
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
        this.playersNames = [];
        this.playersList = [];
        this.app = app;
        this.backgroundTexture = PIXI.Texture.from('img/newGame/background-start-game.jpg');
        this.startButtonTexture = PIXI.Texture.from('img/newGame/startButton.png');
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
    buildButton() {
        this.startButton = new PIXI.Sprite(this.startButtonTexture);
        this.startButton.x = 525;
        this.startButton.y = 650;
        this.startButton.width = 164;
        this.startButton.height = 33;
        this.startButton.interactive = true;
        this.startButton.visible = false;
        this.app.stage.addChild(this.startButton);
        this.startButton.on('click', () => {
            this.playerListPageCallback();
        });
    }
    showStartButton() {
        this.startButton.visible = true;
    }
    hideStartButton() {
        this.startButton.visible = false;
    }
    buildPlayerList() {
        this.playersListContainer = new PIXI.Container();
        this.app.stage.addChild(this.playersListContainer);
        this.playersListContainer.x = 400;
        this.playersListContainer.y = 408;
        let i = 0;
        for (let y = 0; y <= 150; y += 50) {
            for (let x = 0; x <= 300; x += 300) {
                const playerNameString = this.playersList[i] ? this.playersList[i].name : '...';
                const playerName = this.buildPlayerName(playerNameString, x, y);
                this.playersListContainer.addChild(playerName);
                this.playersNames.push(playerName);
                this.setPlayerName(i, playerNameString);
                i++;
            }
        }
    }
    refreshPlayerList(players) {
        if (this.playersNames.length === 0) {
            this.playersList = players;
            return;
        }
        let i = 0;
        players.forEach((playerInfo) => {
            this.setPlayerName(i, playerInfo.name);
            i++;
        });
        if (players.length > 1) {
            this.showStartButton();
        }
        else {
            this.hideStartButton();
        }
    }
    buildPlayerName(playerName, posx, posy) {
        const playerNameText = new PIXI.Text(playerName, this.linkStyle);
        playerNameText.x = posx;
        playerNameText.y = posy;
        playerNameText.visible = true;
        return playerNameText;
    }
    setPlayerName(index, playerNameString) {
        this.playersNames[index].visible = false;
        this.playersNames[index].text = playerNameString;
        if (this.playersNames[index].width > 280) {
            while (this.playersNames[index].width > 260) {
                playerNameString = playerNameString.substring(0, playerNameString.length - 1);
                this.playersNames[index].text = playerNameString;
            }
            this.playersNames[index].text = playerNameString + '...';
            ;
        }
        this.playersNames[index].visible = true;
    }
    setCallback(playerListPageCallback) {
        this.playerListPageCallback = playerListPageCallback;
    }
    display(gameId) {
        this.displayBackground();
        this.displayGameId(gameId);
        this.displayLink(gameId);
        this.buildButton();
        this.buildPlayerList();
    }
    destroyPage() {
        document.getElementById('gameLink').hidden = true;
    }
}
exports.PlayersListPage = PlayersListPage;
