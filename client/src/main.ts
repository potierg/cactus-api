import { io } from "socket.io-client";
import { Home } from "./home";
import { Cactus } from "./cactus";
import { GameRenderer } from "./gameRenderer";
import { App } from "./app";

const socket = io('sheltered-ravine-51287.herokuapp.com');
let homeRenderer: Home = null;
let isHost = true;

const runGame = (data) => {
    const gameRenderer = new GameRenderer(homeRenderer.getApp());
    document.getElementById('canvas').appendChild(gameRenderer.getApp().view);

    const cactus = new Cactus(homeRenderer.getGameId(), data, homeRenderer.getPlayerInfos());
    cactus.setSocket(socket);
    cactus.setIsHost(isHost);
    cactus.setGameRenderer(gameRenderer);

    cactus.runGame();
    return;
}

// When the window has loaded, add the view to the DOM.
window.onload = () => {
    var h = window.innerHeight;

    const params = decodeURI(window.location.search)
    .replace('?', '')
    .split('&')
    .map(param => param.split('='))
    .reduce((values, [ key, value ]) => {
        values[ key ] = value
        return values
    }, {});

    let gameId = null;
    if (params['game']) {
        gameId = +params['game'];
        isHost = false;
    }

    homeRenderer = new Home(+gameId);
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
        App.onResize(homeRenderer.getApp());
    });
};
