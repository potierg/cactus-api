"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Home = void 0;
const CactusApi_1 = require("./services/CactusApi");
const app_1 = require("./app");
const homePage_1 = require("./pages/homePage");
const joinPage_1 = require("./pages/joinPage");
const playersListPage_1 = require("./pages/playersListPage");
class Home {
    constructor(gameId) {
        this.gameId = null;
        this.playerInfos = null;
        this.socketId = null;
        this.playerListDisplayed = false;
        this.gameId = gameId;
        this.app = app_1.App.buildApp();
        this.homePage = new homePage_1.HomePage(this.app);
        this.joinPage = new joinPage_1.JoinPage(this.app);
        this.playersListPage = new playersListPage_1.PlayersListPage(this.app);
        const defaultIcon = "url('img/home/mini-cursor.png'),auto";
        this.app.renderer.plugins.interaction.cursorStyles.default = defaultIcon;
        this.homePage.displayBackground();
        this.homePage.displayWaiting();
        this.homePage.setCallback(this.homePageCallback.bind(this));
        this.joinPage.setCallback(this.joinPageCallback.bind(this));
        this.playersListPage.setCallback(this.playerListPageCallback.bind(this));
    }
    homePageCallback(buttonId) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (buttonId) {
                case 'createGame':
                    this.homePage.destroyPage();
                    this.homePage.displayBackground();
                    this.homePage.displayWaiting();
                    this.gameId = yield CactusApi_1.CactusApi.newGame();
                    this.homePage.hideWaiting();
                    this.joinPage.display(this.gameId);
                    break;
            }
        });
    }
    joinPageCallback(playerName) {
        return __awaiter(this, void 0, void 0, function* () {
            this.joinPage.destroyPage();
            this.homePage.displayBackground();
            this.homePage.displayWaiting();
            const response = yield CactusApi_1.CactusApi.joinGame(this.gameId, playerName, this.socketId);
            this.playerInfos = response;
            this.homePage.hideWaiting();
            this.playersListPage.display(this.gameId);
        });
    }
    playerListPageCallback() {
        return __awaiter(this, void 0, void 0, function* () {
            yield CactusApi_1.CactusApi.runGame(this.gameId);
        });
    }
    setSocketId(socketId) {
        this.socketId = socketId;
        if (this.gameId) {
            this.homePage.displayBackground();
            this.joinPage.display(this.gameId);
        }
        else {
            this.homePage.displayHomePage();
        }
    }
    setPlayersList(playersList) {
        this.playersListPage.refreshPlayerList(playersList);
    }
    getApp() {
        return this.app;
    }
    getGameId() {
        return this.gameId;
    }
    getPlayerInfos() {
        return this.playerInfos;
    }
    clear() {
        while (this.app.stage.children[0]) {
            this.app.stage.removeChild(this.app.stage.children[0]);
        }
        this.playersListPage.destroyPage();
    }
}
exports.Home = Home;
