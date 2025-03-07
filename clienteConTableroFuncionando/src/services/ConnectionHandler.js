import { io } from "../../node_modules/socket.io-client/dist/socket.io.esm.min.js";
import { GameService } from "./GameService.js";
import { UIv1 } from "../UIv1.js";

export const ConnectionHandler = {
    connected: false,
    socket: null,
    url: null,
    controller: null,
    init: (url, controller, onConnectedCallBack, onDisconnectedCallBack) => {
        ConnectionHandler.controller = controller;
        ConnectionHandler.socket = io(url);
        let { socket } = ConnectionHandler;
        socket.onAny((message, payload) => {
            console.log("Esta llegando es este: ");
            console.log(payload);
            console.log(payload.type);
            console.log(payload.content);
        });

        socket.on("connect", (data) => {
            socket.on("connectionStatus", (data) => {
                ConnectionHandler.connected = true;
                console.log(data);
                onConnectedCallBack();
            });
            socket.on("message", (payload) => {
                ConnectionHandler.controller.actionController(payload);
                //socket.emit("message",{ type: "HELLO", content: "Hello world!"});
            });
            socket.on("disconnect", () => {
                ConnectionHandler.connected = false;
                onDisconnectedCallBack();
            });
        });

        socket.on("playerId", (data) => {
            UIv1.playerId = data.id;
            console.log("Esta es la id del jugador:", UIv1.playerId);
        });
       
        socket.on("directionUpdated", (data) => {
            UIv1.playerId = data.id;
            console.log("El servidor devolvió esta dirección", data);
        });
    },
    updateDirection: (direction) => {
        ConnectionHandler.socket.emit("updateDirection", { direction: direction });
        console.log("pasa la dirección al servidor");
    },
    movePlayer: () => {
        ConnectionHandler.socket.emit("movePlayer", "puedo avanzar?");
        console.log("El mensaje de movimiento ha sido enviado al servidor");
    },
    hola: () => {
        console.log("Holaaa");
    }
};