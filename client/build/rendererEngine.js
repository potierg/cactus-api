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
exports.RendererEngine = void 0;
const PIXI = __importStar(require("pixi.js"));
class RendererEngine {
    constructor() {
        this.app = null;
        this.textures = {};
        this.createCard = (x, y) => {
            const card = new PIXI.Sprite(texture);
            card.anchor.set(0.5);
            card.x = x;
            card.y = y;
            card.width = 110;
            card.height = 150;
            return card;
        };
        this.app = new PIXI.Application({
            width: 1280,
            height: 720,
            backgroundColor: 0x000000,
            resolution: window.devicePixelRatio || 1
        });
    }
    initTextures() {
        this.textures.backCard = PIXI.Texture.from('img/card-back.png');
    }
}
exports.RendererEngine = RendererEngine;
