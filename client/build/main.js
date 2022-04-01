"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const home_1 = require("./home");
const cactus_1 = require("./cactus");
const gameRenderer_1 = require("./gameRenderer");
const app_1 = require("./app");
const socket = (0, socket_io_client_1.io)('ws://localhost:5000');
let homeRenderer = null;
let isHost = true;
const runGame = (data) => {
    const gameRenderer = new gameRenderer_1.GameRenderer(homeRenderer.getApp());
    document.getElementById('canvas').appendChild(gameRenderer.getApp().view);
    const cactus = new cactus_1.Cactus(homeRenderer.getGameId(), data, homeRenderer.getPlayerInfos());
    cactus.setSocket(socket);
    cactus.setIsHost(isHost);
    cactus.setGameRenderer(gameRenderer);
    cactus.runGame();
    return;
};
// When the window has loaded, add the view to the DOM.
window.onload = () => {
    var h = window.innerHeight;
    const params = decodeURI(window.location.search)
        .replace('?', '')
        .split('&')
        .map(param => param.split('='))
        .reduce((values, [key, value]) => {
        values[key] = value;
        return values;
    }, {});
    let gameId = null;
    if (params['game']) {
        gameId = +params['game'];
        isHost = false;
    }
    homeRenderer = new home_1.Home(+gameId);
    document.getElementById('canvas').appendChild(homeRenderer.getApp().view);
    // client-side
    socket.on("connect", () => {
        homeRenderer.setSocketId(socket.id);
    });
    socket.on("error", (error) => {
        console.log('socket error', error);
        document.getElementById('errorSocket').hidden = false;
    });
    socket.on('players waitings', (data) => {
        homeRenderer.setPlayersList(data['players']);
    });
    socket.on('start game', (data) => {
        homeRenderer.clear();
        runGame(data);
    });
    window.addEventListener("resize", () => {
        app_1.App.onResize(homeRenderer.getApp());
    });
};
