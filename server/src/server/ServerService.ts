import { DefaultEventsMap, Server, Socket } from 'socket.io';
import http from 'http';
import { GameService } from '../game/GameService';
import { AnyTxtRecord } from 'dns';
import { RoomService } from '../room/RoomService';

export class ServerService {
    private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null;
    private active : boolean;
    static messages = {
        out: {
            new_player: "NEW_PLAYER",
            PLAYER_DIRECTION_UPDATED : "Nueva_direccion"
        } 
    }

    public inputMessage = [
            {
                type: "HELLO",
                do: this.doHello
            },
            {
                type: "BYE",
                do: this.doBye
            }
        ];

    private static instance: ServerService;
    private constructor() {
        this.io = null;
        this.active = false;
    };

    static getInstance(): ServerService {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ServerService();
        return this.instance;
    }

    public init(httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
        this.io = new Server(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });
        this.active = true;

        this.io.on('connection', (socket) => {
            socket.emit("connectionStatus", { status: true });
            socket.emit("playerId", { id: socket.id });
            GameService.getInstance().addPlayer(GameService.getInstance().buildPlayer(socket));
            
            socket.on("message", (data)=>{
                const doType = this.inputMessage.find(item => item.type == data.type);
                if (doType !== undefined) {
                    doType.do(data);
                }
            });

            socket.on("updateDirection", (data) => {
                console.log("Mensaje direccion: ", data);
            });

            socket.on("movePlayer", (data) => {
                console.log("Mensaje de movimiento: ", data);
               
            });

            socket.on('disconnect', () => {
                console.log('Un cliente se ha desconectado:', socket.id);
            });
            socket.on("updateDirection", (data) => {
                const { direction } = data;
                console.log("Mensaje dirección recibido: ", direction);
    
                // Buscar el jugador correspondiente en el servicio de juego
                const player = GameService.getInstance().getPlayerBySocket(socket);
    
                if (player) {
                    player.direction = direction;  // Actualiza la dirección del jugador
    
                    // Emitir la actualización de dirección al cliente
                    socket.emit("directionUpdated", { direction: player.direction });
                    console.log("para comprobar", player.direction, "es la direccion");

                    // Opcional: Enviar la actualización de dirección a los demás jugadores
                    const room = RoomService.getInstance().getRoomByPlayer(player);
                    if (room) {
                        // Usamos el mensaje de la propiedad estática
                        ServerService.getInstance().sendMessage(room.name, ServerService.messages.out.PLAYER_DIRECTION_UPDATED, {
                            playerId: player.id.id,
                            direction: player.direction
                        });
                    }
                }
            });
        });

    }

    public addPlayerToRoom(player : Socket, room: String) {
        player.join(room.toString());
    }

    public sendMessage(room: String | null, type: String, content: any) {
        console.log(content);
        if (this.active && this.io!=null) {
            if (room != null) {
                    this.io?.to(room.toString()).emit("message", {
                        type, content
                    })
            }
        }
    }

    public gameStartMessage() {
        //
    }

    public isActive() {
        return this.active;
    }

    private doHello(data: String) {
        console.log("Hola");
        console.log(data);
    }

    private doBye(data: String) {
        console.log("Adios");
        console.log(data);
    }
}