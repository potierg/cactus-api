import * as PIXI from "pixi.js"

export class Textures {
    private textures: {[key : string]: PIXI.Texture} = {};

    constructor() {
        this.initTextures();
    }

    initTextures() {
        this.textures.backCard = PIXI.Texture.from('img/card-back.png');
        this.textures.backCardGreen = PIXI.Texture.from('img/card-back-green.png');
        this.textures.backCardEye = PIXI.Texture.from('img/card-back-eye.png');
        this.textures.boardGame = PIXI.Texture.from('img/board-game.png');
        this.textures.revealBtn = PIXI.Texture.from('img/button.png');
        this.textures.cactusBtn = PIXI.Texture.from('img/cactus-btn.png');
        this.textures.startNewGameButton = PIXI.Texture.from('img/StartNewGameButton.png');

        ['C', 'D', 'H', 'S'].forEach((color) => {
            for (let i = 1; i <= 10; i++) {
                this.textures[color + i] = PIXI.Texture.from('img/cards/' + color + '/' + i + '.png');
            }

            ['J', 'Q', 'K'].forEach((val) => {
                this.textures[color + val] = PIXI.Texture.from('img/cards/' + color + '/' + val + '.png');
            })
        });
    }

    getById(id: string): PIXI.Texture {
        return this.textures[id];
    }
}