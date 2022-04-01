import fetch from 'node-fetch';

export class CactusApi {
    static async newGame(): Promise<number> {
        const response = await fetch(`/game/new`, {method: 'POST'});
        return +(await response.json())['gameId'];
    }

    static async joinGame(gameId, playerName, socketId): Promise<{playerId: number, secretKey: number, name: number}> {
        const response = await fetch(`/game/player/new`, {method: 'POST', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({
            gameId,
            playerName,
            socketId
        })});
        return await response.json();
    }

    static async runGame(gameId) {
        await fetch(`/game/start`, {method: 'POST', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({
            gameId
        })});    
    }
}