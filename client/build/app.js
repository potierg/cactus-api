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
exports.App = void 0;
const PIXI = __importStar(require("pixi.js"));
class App {
    static getRatio() {
        return App.getDimensions().height / 720;
    }
    static getDimensions() {
        let height = window.innerHeight;
        let width = window.innerHeight * (1280 / 720);
        if (window.innerWidth < width) {
            height = window.innerWidth * (720 / 1280);
            width = window.innerWidth;
        }
        return { height, width };
    }
    static updateInputs(ratio) {
        const styles = ['left', 'top', 'width', 'height', 'border-width', 'font-size'];
        const inputPlayerNameSpecs = {
            left: 234, top: 422, width: 760, height: 74,
            'border-width': 6, 'font-size': 35
        };
        styles.forEach((style) => {
            document.getElementById('playerNameInput').style[style] = (inputPlayerNameSpecs[style] * ratio) + 'px';
        });
        const inputGameLinkSpecs = {
            left: 174, top: 274, width: 761, height: 74,
            'border-width': 6, 'font-size': 35
        };
        styles.forEach((style) => {
            document.getElementById('gameLink').style[style] = (inputGameLinkSpecs[style] * ratio) + 'px';
        });
    }
    static buildApp() {
        let ratio = App.getRatio();
        App.updateInputs(ratio);
        return new PIXI.Application({
            width: 1280,
            height: 720,
            backgroundColor: 0xFFFFFF,
            resolution: ratio
        });
    }
    static onResize(app) {
        let ratio = App.getRatio();
        App.updateInputs(ratio);
        app.renderer.resolution = ratio;
        return;
        // Resize canvas
        let height = window.innerHeight;
        let width = window.innerHeight * (1280 / 720);
        if (window.innerWidth < width) {
            height = window.innerWidth * (720 / 1280);
            width = window.innerWidth;
        }
        console.log(window.innerWidth, window.innerHeight, width, height);
        document.querySelector('#canvas > canvas').style.width = width + 'px';
        document.querySelector('#canvas > canvas').style.height = height + 'px';
    }
}
exports.App = App;
