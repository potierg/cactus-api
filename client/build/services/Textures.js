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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Textures = void 0;
const PIXI = __importStar(require("pixi.js"));
class Textures {
    constructor() {
        this.textures = {};
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
            });
        });
    }
    getById(id) {
        return this.textures[id];
    }
}
exports.Textures = Textures;
