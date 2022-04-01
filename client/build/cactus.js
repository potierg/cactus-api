"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cactus = void 0;
const CactusSocketApi_1 = require("./services/CactusSocketApi");
class Cactus {
    constructor(gameId, gameData, playerInfos) {
        this.playersName = {};
        this.drawed = false;
        this.lastTrash = null;
        this.canSeeCard = false;
        this.gameEnd = false;
        this.gameId = +gameId;
        this.playerId = +(playerInfos === null || playerInfos === void 0 ? void 0 : playerInfos.playerId);
        gameData.players.forEach((playerInfo) => {
            this.playersName[playerInfo.id] = playerInfo.name;
        });
    }
    setIsHost(isHost) {
        this.isHost = isHost;
    }
    setSocket(socket) {
        this.socket = socket;
        CactusSocketApi_1.CactusSocketApi.listenEvents(this.socket, this.onSocketEvent.bind(this));
    }
    setGameRenderer(gameRenderer) {
        this.gameRenderer = gameRenderer;
    }
    onSocketEvent(eventType, data) {
        switch (eventType) {
            case 'cardsRevealed':
                this.revealCards(data);
                break;
            case 'playersStart':
                this.gameStart();
                break;
            case 'playerPlay':
                this.playerCanPlay();
                break;
            case 'refreshTrash':
                this.refreshTrash(data);
                break;
            case 'drawedCard':
                this.refreshDrawedCard(data);
                break;
            case 'successTrash':
                this.successTrashMiddleGame(data);
                break;
            case 'cactus':
                this.cactusCalled(data);
                break;
            case 'revelation':
                this.allPlayerRevealed(data);
                break;
            case 'gameOver':
                this.gameOver(data);
                break;
            case 'newGame':
                this.restartGame();
                break;
        }
    }
    revealCards(cards) {
        this.gameRenderer.showRevealed(cards);
        this.gameRenderer.hideRevealButton();
        setTimeout(() => {
            if (this.gameEnd) {
                return;
            }
            this.gameRenderer.hideRevealed();
        }, 3000);
    }
    gameStart() {
        this.gameRenderer.displayMessage('Game Start');
    }
    playerCanPlay() {
        this.gameRenderer.displayMessage('Your turn !!!');
        this.gameRenderer.setDrawInteraction(true);
        this.gameRenderer.setActiveDraw(true);
        this.gameRenderer.setCardsInteraction(this.lastTrash !== null);
        this.gameRenderer.setTrashInteraction(this.lastTrash !== null);
    }
    refreshTrash(card) {
        this.gameRenderer.displayTrash(card ? card : null);
        this.lastTrash = card;
        this.gameRenderer.setCardsInteraction(card !== null);
    }
    refreshDrawedCard(card) {
        if (!card) {
            this.gameRenderer.hideDraw();
        }
        this.gameRenderer.setActiveDraw(false);
        this.gameRenderer.setActiveCards(true);
        this.gameRenderer.setCardsInteraction(true);
        this.gameRenderer.setDrawInteraction(false);
        this.gameRenderer.setTrashInteraction(false);
        this.gameRenderer.showDrawCard(card);
        if (card.number === 8) {
            this.gameRenderer.showEyeCards();
            this.canSeeCard = true;
        }
    }
    successTrashMiddleGame(cardId) {
        this.gameRenderer.hideCard(cardId);
    }
    cactusCalled(playerId) {
        this.gameRenderer.hideCactusBtn();
        if (playerId !== this.playerId) {
            this.gameRenderer.displayMessage(this.playersName[playerId] + ' called CACTUS : Last Turn');
        }
        else {
            this.gameRenderer.displayMessage('You called CACTUS : Last Turn');
        }
    }
    allPlayerRevealed(playerCards) {
        playerCards.forEach((playerCardInfos) => {
            if (this.playerId === +playerCardInfos.playerId) {
                let cardId = 0;
                this.gameRenderer.showRevealed(playerCardInfos.cards.map((card) => {
                    return {
                        cardId: cardId++,
                        card
                    };
                }));
            }
            else {
                console.log('TODO => other cards => ', playerCardInfos.cards);
            }
        });
        //Reveal all players cards
    }
    gameOver(winnerId) {
        this.gameEnd = true;
        if (!winnerId) {
            this.gameRenderer.displayMessage('NO ONE WIN !!! Losers');
        }
        else if (winnerId !== this.playerId) {
            this.gameRenderer.displayMessage(this.playersName[winnerId] + ' WIN: Loser');
        }
        else {
            this.gameRenderer.displayMessage('**WINNER**');
        }
        this.gameRenderer.setCardsInteraction(false);
        this.gameRenderer.setDrawInteraction(false);
        this.gameRenderer.setTrashInteraction(false);
        if (this.isHost) {
            this.gameRenderer.showRestartButton();
        }
    }
    runGame() {
        this.gameRenderer.buildBoard();
        this.gameRenderer.displayTrash();
        this.gameRenderer.setClickCallback(this.clickCallback.bind(this));
        this.gameRenderer.setDrawInteraction(false);
        this.gameRenderer.setTrashInteraction(false);
        this.gameRenderer.setCardsInteraction(false);
        this.gameRenderer.displayMessage('Reveal your cards for play');
    }
    restartGame() {
        this.drawed = false;
        this.lastTrash = null;
        this.canSeeCard = false;
        this.gameEnd = false;
        this.gameRenderer.showRevealButton();
        this.gameRenderer.setDrawInteraction(false);
        this.gameRenderer.setTrashInteraction(false);
        this.gameRenderer.setCardsInteraction(false);
        this.gameRenderer.resetCards();
        this.gameRenderer.displayMessage('Reveal your cards for play');
    }
    clickCallback(clickedElementId) {
        switch (clickedElementId) {
            case 'reveal':
                this.gameRenderer.displayMessage('Waiting for players to see their cards...');
                CactusSocketApi_1.CactusSocketApi.startGame(this.socket, this.gameId, this.playerId);
                break;
            case 'draw':
            case 'trash':
                this.drawed = true;
                CactusSocketApi_1.CactusSocketApi.drawCard(this.socket, this.gameId, this.playerId, clickedElementId);
                break;
            case 'cactus':
                CactusSocketApi_1.CactusSocketApi.callCactus(this.socket, this.gameId, this.playerId);
                this.gameRenderer.hideCactusBtn();
                break;
            case 'restartGame':
                this.gameRenderer.hideRestartButton();
                CactusSocketApi_1.CactusSocketApi.restartGame(this.socket, this.gameId);
                break;
            case 'drawCard':
            default:
                if (this.canSeeCard && clickedElementId !== 'drawCard') {
                    CactusSocketApi_1.CactusSocketApi.revealOneCard(this.socket, this.gameId, this.playerId, clickedElementId);
                    this.canSeeCard = false;
                    this.gameRenderer.hideEyeCards();
                    return;
                }
                if (this.drawed) {
                    this.trashCard();
                    CactusSocketApi_1.CactusSocketApi.trashCard(this.socket, this.gameId, this.playerId, clickedElementId);
                    this.gameRenderer.displayMessage('Waiting for players to play...');
                }
                else {
                    if (clickedElementId !== 'drawCard') {
                        CactusSocketApi_1.CactusSocketApi.trashCardMiddleGame(this.socket, this.gameId, this.playerId, clickedElementId);
                    }
                }
                this.drawed = false;
                break;
        }
    }
    trashCard() {
        this.gameRenderer.setDrawInteraction(false);
        this.gameRenderer.setTrashInteraction(false);
        this.gameRenderer.cleanDrawCard();
        this.gameRenderer.setActiveCards(false);
        this.gameRenderer.setCardsInteraction(this.lastTrash !== null);
        this.gameRenderer.setActiveCards(false);
    }
}
exports.Cactus = Cactus;
