import { Card } from "../interfaces/CardInterface";

export class Cards {
    // Create Draw cards and random shuffle
    static createDraw(): Card[] {
        const allCards: Card[] = [];
        const colors = ['H', 'C', 'D', 'S'];

        colors.forEach((color) => {
            for(let n = 1; n <= 13; n++) {
                let value = n;
                if (value >= 11 && value <= 12) {
                    value = 10;
                } else if (value === 13) {
                    value = 0;
                }
                const newCard: Card = {color, number: n, value}
                allCards.push(newCard);
            }
        });

        return allCards.sort((a, b) => 0.5 - Math.random());
    }
}