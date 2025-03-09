export const ELEMENTS = {
    bush: 5,
    player: 1
};

export class Board {
    #map = null;
    #players = [];
    #states = {
        NO_BUILD: 0,
        BUILD: 1
    };
    #state = null;

    constructor() {
        this.#state = this.#states.NO_BUILD;
    }

    build(payload) {
        if (!payload) {
            console.error("Error: payload inválido");
            return;
        }
    
        const { size, elements } = payload;
    
        // Asegurar que this.#map sea un array bidimensional
        this.#map = new Array(size).fill(null).map(() => new Array(size).fill(0));
    
        // Colocar arbustos
        elements.forEach(element => {
            if (this.#map[element.x] && this.#map[element.x][element.y] !== undefined) {
                this.#map[element.x][element.y] = ELEMENTS.bush;
            } else {
                console.error(`Posición inválida para un arbusto: (${element.x}, ${element.y})`);
            }
        });
    
        this.#state = this.#states.BUILD;
    }
    
    addPlayer(x, y) {
        if (!this.#map || !this.#map[x] || this.#map[x][y] === undefined) {
            console.error("Error: no se puede agregar jugador en posición inválida", x, y);
            return;
        }
    
        this.#map[x][y] = ELEMENTS.player;
    }
    

    get map() {
        return this.#state === this.#states.BUILD ? this.#map : undefined;
    }

    get players() {
        return this.#players;
    }
}
