import { Board } from "../entities/Board.js";
import { Queue } from "../Queue.js";
import { UIv1 } from "../UIv1.js";
export class GameService {
    #states = {
        WAITING : 0,
        PLAYING : 1,
        ENDED : 2
    };
    #ui = null;
    #players = [];
    #board = null;
    #queue = null;
    #state = null;
    #parallel = null;

    #actionsList = {
        "BOARD" : this.do_newBoard.bind(this),
        "NEW_PLAYER" : this.do_newPlayer.bind(this),
        "Nueva_direccion": this.do_changeDirection.bind(this)
    };

    constructor(ui){
        this.#state = this.#states.WAITING;
        this.#board = new Board();
        this.#queue = new Queue();
        this.#parallel = null;
        this.checkScheduler();
        this.#ui = UIv1;
    }

    checkScheduler() {
        if (!this.#queue.isEmpty()) {
            if (this.#parallel == null) {
                this.#parallel = setInterval(
                    async ()=>{
                        const action = this.#queue.getMessage();
                        if (action != undefined) {
                            await this.#actionsList[action.type] (action.content);
                        } else {
                            this.stopScheduler();
                        }
                    }
                );
            }
        }
    }

    stopScheduler() {
        clearInterval(this.#parallel);
        this.#parallel = null;
    }

    do (data) {
        this.#queue.addMessage(data);
        this.checkScheduler();
    };

    async do_newBoard(payload) {
        this.#board.build(payload);
        this.#ui.drawBoard(this.#board.map);

        this.#ui.drawPlayers(this.#players);
    };

   async do_newPlayer(payload) {
    if (!this.#board.map) {
        console.error("Error: el tablero aún no está construido");
        return;
    }

    console.log("Nuevo jugador conectado en:", payload.x, payload.y);
    this.#board.addPlayer(payload.x, payload.y);
    this.#ui.drawPlayers(this.#board.players);
}

    
    
    async do_changeDirection(payload) {
        console.log("Dirección cambiada:", payload);
        const { playerId, direction } = payload;
    
        const player = this.#players.find(p => p.id === playerId);
        if (player) {
            player.direction = direction;
            console.log(` Jugador ${playerId} apunta a la dirección ${direction}`);
    
        } else {
            console.error(`Jugador no encontrado: ${playerId}`);
        }
    }
}