import * as PIXI from "pixi.js"

export class App {
    static getRatio(): number {
        return App.getDimensions().height / 720;
    }

    static getDimensions() {
        let height = window.innerHeight;
        let width = window.innerHeight * (1280/720);

        if (window.innerWidth < width) {
            height = window.innerWidth * (720/1280);
            width = window.innerWidth;
        }
        return {height, width};
    }

    static updateInputs(ratio) {
        const styles = ['left', 'top', 'width', 'height', 'border-width', 'font-size'];
        const inputPlayerNameSpecs = {
            left: 234, top: 422, width: 760, height: 74,
            'border-width': 6, 'font-size': 35
        }

        styles.forEach((style) => {
            document.getElementById('playerNameInput').style[style] = (inputPlayerNameSpecs[style] * ratio) + 'px';
        })

        const inputGameLinkSpecs = {
            left: 174, top: 274, width: 761, height: 74,
            'border-width': 6, 'font-size': 35
        }

        styles.forEach((style) => {
            document.getElementById('gameLink').style[style] = (inputGameLinkSpecs[style] * ratio) + 'px';
        });
    }

    static buildApp(): PIXI.Application {
        let ratio = App.getRatio();
        App.updateInputs(ratio);

        return new PIXI.Application({
            width: 1280,
            height: 720,
            backgroundColor: 0xFFFFFF,
            resolution: ratio
        });
    }

    static onResize(app: PIXI.Application) {
        let ratio = App.getRatio();
        App.updateInputs(ratio);

        app.renderer.resolution = ratio;
        return;

        // Resize canvas
        let height = window.innerHeight;
        let width = window.innerHeight * (1280/720);

        if (window.innerWidth < width) {
            height = window.innerWidth * (720/1280);
            width = window.innerWidth;
        }

        console.log(window.innerWidth, window.innerHeight, width, height);
        
        (<HTMLElement>document.querySelector('#canvas > canvas')).style.width = width + 'px';
        (<HTMLElement>document.querySelector('#canvas > canvas')).style.height = height + 'px';
    }
}