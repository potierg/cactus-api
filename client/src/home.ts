import { CactusApi } from "./services/CactusApi";
import * as PIXI from "pixi.js"
import { App } from "./app";
import { HomePage } from "./pages/homePage";
import { JoinPage } from "./pages/joinPage";
import { PlayersListPage } from "./pages/playersListPage";

export class Home {
    private gameId: number = null;
    private playerInfos: any = null;
    private socketId = null;

    private app: PIXI.Application;
    private homePage: HomePage;
    private joinPage: JoinPage;
    private playersListPage: PlayersListPage;
    private playerListDisplayed: boolean = false;

    constructor(gameId: number) {
        this.gameId = gameId;
        this.app = App.buildApp();
        this.homePage = new HomePage(this.app);
        this.joinPage = new JoinPage(this.app);
        this.playersListPage = new PlayersListPage(this.app);

        const defaultIcon = "url('img/home/mini-cursor.png'),auto";
        this.app.renderer.plugins.interaction.cursorStyles.default = defaultIcon;
        this.homePage.displayBackground();
        this.homePage.displayWaiting();
        this.homePage.setCallback(this.homePageCallback.bind(this));
        this.joinPage.setCallback(this.joinPageCallback.bind(this));
        this.playersListPage.setCallback(this.playerListPageCallback.bind(this));
    }

    async homePageCallback(buttonId) {
        switch (buttonId) {
            case 'createGame':
                this.homePage.destroyPage();
                this.homePage.displayBackground();
                this.homePage.displayWaiting();
                this.gameId = await CactusApi.newGame();
                this.homePage.hideWaiting();
                this.joinPage.display(this.gameId);
            break;
        }
    }

   async joinPageCallback(playerName) {
       this.joinPage.destroyPage();
       this.homePage.displayBackground();
       this.homePage.displayWaiting();

       const response = await CactusApi.joinGame(this.gameId, playerName, this.socketId);
       this.playerInfos = response;

       this.homePage.hideWaiting();
       this.playersListPage.display(this.gameId);
    }

    async playerListPageCallback() {
        await CactusApi.runGame(this.gameId);
    }

    setSocketId(socketId) {
        this.socketId = socketId;
        if (this.gameId) {
            this.homePage.displayBackground();
            this.joinPage.display(this.gameId);
        } else {
            this.homePage.displayHomePage();
        }
    }

    setPlayersList(playersList: any[]) {
        this.playersListPage.refreshPlayerList(playersList);
    }

    getApp(): PIXI.Application {
        return this.app;
    }

    getGameId() {
        return this.gameId;
    }

    getPlayerInfos() {
        return this.playerInfos;
    }

    clear() {
        while(this.app.stage.children[0]) { 
            this.app.stage.removeChild(this.app.stage.children[0]);
        }
        this.playersListPage.destroyPage();
    }
}