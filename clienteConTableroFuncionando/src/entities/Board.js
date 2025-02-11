export const ELEMENTS = {
    bush : 5,
    player : 1
};
export class Board {
    #map = null;
    #states = {
        NO_BUILD : 0,
        BUILD : 1
    }
    #state = null;

    constructor() {
        this.#state = this.#states.NO_BUILD;
    }

    build(payload) {
        // const { size, elements } = payload;
        // this.#map = new Array(size).fill().map(() => new Array(size).fill(0));
        // elements.forEach(element=> this.#map[element.x][element.y]= ELEMENTS.bush);
        // this.#state = this.#states.BUILD;

        if (payload !== undefined) {
            const { size, elements } = payload;

            this.#map = new Array(size).fill(null).map(() => new Array(size).fill(0));

            // Place bushes in the map
            elements.forEach(element => this.#map[element.x][element.y] = ELEMENTS.bush);

            // Make the corners available for players
            const corners = [
                { x: 0, y: 0 },
                { x: size - 1, y: 0 },
                { x: 0, y: size - 1 },
                { x: size - 1, y: size - 1 }
            ];

            corners.forEach(corner => {
                // Ensure the corners are not occupied
                if (this.#map[corner.x][corner.y] === 0) {
                    this.#map[corner.x][corner.y] = ELEMENTS.player;
                }
            });

            this.#state = this.#states.BUILD;
        } else {
            console.log('It is undefined');
        }

    }

    get map() {
        if (this.#state === this.#states.BUILD) {
            return this.#map;
        } return undefined;
    }
}