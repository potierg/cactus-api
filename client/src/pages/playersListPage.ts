import * as PIXI from "pixi.js"

import config from '../environment/environment.json';

export class PlayersListPage {
    private app: PIXI.Application;
    private backgroundTexture: PIXI.Texture;
    private background: PIXI.Sprite;

    private gameId: PIXI.Text;
    private startButtonTexture: PIXI.Texture;

    private linkString: string;
    private linkStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#000000'], // gradient
        lineJoin: 'round',
    });

    private startButton: PIXI.Sprite;
    private playersNames: PIXI.Text[] = [];
    private playersListContainer: PIXI.Container;
    private playersList = [];

    private playerListPageCallback: () => void;

    constructor (app: PIXI.Application) {
        this.app = app;
        this.backgroundTexture = PIXI.Texture.from('img/newGame/background-start-game.jpg');
        this.startButtonTexture = PIXI.Texture.from('img/newGame/startButton.png');
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

    private buildButton() {
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

    private showStartButton() {
        this.startButton.visible = true;
    }

    private hideStartButton() {
        this.startButton.visible = false;
    }

    buildPlayerList() {
        this.playersListContainer = new PIXI.Container();
        this.app.stage.addChild(this.playersListContainer);
        this.playersListContainer.x = 400;
        this.playersListContainer.y = 408;

        let i = 0;
        for (let y = 0; y <= 150; y+=50) {
            for (let x = 0; x <= 300; x+=300) {
                const playerNameString = this.playersList[i] ? this.playersList[i].name : '...';
                const playerName: PIXI.Text = this.buildPlayerName(playerNameString, x, y);
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
        } else {
            this.hideStartButton();
        }
    }

    buildPlayerName(playerName, posx, posy): PIXI.Text {
        const playerNameText = new PIXI.Text(playerName, this.linkStyle);
        playerNameText.x = posx;
        playerNameText.y = posy;
        playerNameText.visible = true;
        return playerNameText;
    }

    setPlayerName(index, playerNameString: string) {
        this.playersNames[index].visible = false;
        this.playersNames[index].text = playerNameString;

        if (this.playersNames[index].width > 280) {
            while (this.playersNames[index].width > 260) {
                playerNameString = playerNameString.substring(0, playerNameString.length - 1);
                this.playersNames[index].text = playerNameString;
            }
            this.playersNames[index].text = playerNameString + '...';;
        }
        this.playersNames[index].visible = true;
    }

    setCallback(playerListPageCallback: () => void) {
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