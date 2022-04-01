import { Socket } from "socket.io-client";
import { GameRenderer } from "./gameRenderer";
import { Card } from "./interfaces/CardInterface";
import { CactusSocketApi } from "./services/CactusSocketApi";

export class Cactus {
    private isHost: boolean;
    private socket: Socket;
    private gameRenderer: GameRenderer;
    private gameId: number;
    private playersName: {[key: string]: string} = {};
    private playerId: number;
    private drawed: boolean = false;
    private lastTrash: Card = null;
    private canSeeCard = false;
    private gameEnd = false;

    constructor(gameId: number,
        gameData: {cards: Card[], firstToPlay: boolean, playerNumber: number, players: {id: string, name: string}[]},
        playerInfos: { playerId: number, name: string}) {
            this.gameId = +gameId;
            this.playerId = +playerInfos?.playerId;

            gameData.players.forEach((playerInfo) => {
                this.playersName[playerInfo.id] = playerInfo.name;
            });
    }

    setIsHost(isHost) {
        this.isHost = isHost;
    }

    setSocket(socket: Socket) {
        this.socket = socket;
        CactusSocketApi.listenEvents(this.socket, this.onSocketEvent.bind(this));
    }

    setGameRenderer(gameRenderer: GameRenderer) {
        this.gameRenderer = gameRenderer;
    }

    onSocketEvent(eventType: string, data?: any): void {
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

    revealCards(cards: {cardId: number, card: Card}[]) {
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

    refreshTrash(card: Card) {
        this.gameRenderer.displayTrash(card ? card : null);
        this.lastTrash = card;
        this.gameRenderer.setCardsInteraction(card !== null);
    }

    refreshDrawedCard(card: Card) {
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

    successTrashMiddleGame(cardId: number) {
        this.gameRenderer.hideCard(cardId);
    }

    cactusCalled(playerId: number) {
        this.gameRenderer.hideCactusBtn();
        if (playerId !== this.playerId) {
            this.gameRenderer.displayMessage(this.playersName[playerId] + ' called CACTUS : Last Turn');
        } else {
            this.gameRenderer.displayMessage('You called CACTUS : Last Turn');
        }
    }

    allPlayerRevealed(playerCards: {playerId: string, cards: Card[]}[]) {
        playerCards.forEach((playerCardInfos: {playerId: string, cards: Card[]}) => {
            if (this.playerId === +playerCardInfos.playerId) {
                let cardId = 0;
                this.gameRenderer.showRevealed(playerCardInfos.cards.map((card: Card) => {
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

    gameOver(winnerId: number) {
        this.gameEnd = true;
        if (!winnerId) {
            this.gameRenderer.displayMessage('NO ONE WIN !!! Losers');   
        }
        else if (winnerId !== this.playerId) {
            this.gameRenderer.displayMessage(this.playersName[winnerId] + ' WIN: Loser');
        } else {
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
                CactusSocketApi.startGame(this.socket, this.gameId, this.playerId);
                break;
            case 'draw':
            case 'trash':
                this.drawed = true;
                CactusSocketApi.drawCard(this.socket, this.gameId, this.playerId, clickedElementId);
                break;
            case 'cactus':
                CactusSocketApi.callCactus(this.socket, this.gameId, this.playerId);
                this.gameRenderer.hideCactusBtn();
                break;
            case 'restartGame':
                this.gameRenderer.hideRestartButton();
                CactusSocketApi.restartGame(this.socket, this.gameId);
                break;
            case 'drawCard':
            default:
                if (this.canSeeCard && clickedElementId !== 'drawCard') {
                    CactusSocketApi.revealOneCard(this.socket, this.gameId, this.playerId, clickedElementId);
                    this.canSeeCard = false;
                    this.gameRenderer.hideEyeCards();
                    return;
                }
                if (this.drawed) {
                    this.trashCard();
                    CactusSocketApi.trashCard(this.socket, this.gameId, this.playerId, clickedElementId);
                    this.gameRenderer.displayMessage('Waiting for players to play...');
                } else {
                    if (clickedElementId !== 'drawCard') {
                        CactusSocketApi.trashCardMiddleGame(this.socket, this.gameId, this.playerId, clickedElementId);
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