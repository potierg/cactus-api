"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cards = void 0;
class Cards {
    // Create Draw cards and random shuffle
    static createDraw() {
        const allCards = [];
        const colors = ['H', 'C', 'D', 'S'];
        colors.forEach((color) => {
            for (let n = 1; n <= 13; n++) {
                let value = n;
                if (value >= 11 && value <= 12) {
                    value = 10;
                }
                else if (value === 13) {
                    value = 0;
                }
                const newCard = { color, number: n, value };
                allCards.push(newCard);
            }
        });
        return allCards.sort((a, b) => 0.5 - Math.random());
    }
}
exports.Cards = Cards;
//# sourceMappingURL=cards.js.map