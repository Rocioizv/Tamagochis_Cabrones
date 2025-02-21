import { UI_BUILDER } from "./Ui.js";
import { Player } from "./entities/Player.js";
import { ConnectionHandler } from "./services/ConnectionHandler.js";

export const UIv1 = UI_BUILDER.init();


UIv1.initUI = () => {
    const base = document.getElementById(UIv1.uiElements.board);
    base.classList.add("board");

    // Crear contenedor para los botones
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    // Crear botón para girar
    const rotateButton = document.createElement("button");
    rotateButton.innerText = "Girar";
    rotateButton.addEventListener("click", UIv1.rotatePlayer);
    buttonContainer.appendChild(rotateButton);

    // Crear botón para avanzar
    const moveButton = document.createElement("button");
    moveButton.innerText = "Avanzar";
    moveButton.addEventListener("click", UIv1.movePlayer);
    buttonContainer.appendChild(moveButton);

    // Crear botón para disparar
    const shootButton = document.createElement("button");
    shootButton.innerText = "Disparar";
    shootButton.addEventListener("click", UIv1.shoot);
    buttonContainer.appendChild(shootButton);

    // Añadir el contenedor de botones al DOM
    document.body.appendChild(buttonContainer);
}

UIv1.drawBoard = (board) => {
    if (board !== undefined) {
        const base = document.getElementById(UIv1.uiElements.board);
        base.innerHTML = '';

        base.style.gridTemplateColumns = `repeat(${board.length}, 100px)`;
        base.style.gridTemplateRows = `repeat(${board.length}, 100px)`;
        board.forEach(element => element.forEach((element) => {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            if (element === 0) tile.classList.add("floor");
            if (element === 5) tile.classList.add("bush");
            if (element === 1) tile.classList.add("player");
            base.appendChild(tile);
            anime({
                targets: tile,
                opacity: [0, 1],
                duration: (Math.random() * 8000) + 1000,
                easing: 'easeInOutQuad'
            });
        }));
    }
}

UIv1.drawBoard();


UIv1.rotatePlayer = () => {

    Player.direction = (Player.direction + 1) % 4;  // Rota la dirección (0 -> 1 -> 2-> 3-> 0)
    console.log("La dirección es: ", Player.direction);


    ConnectionHandler.updateDirection(Player.direction);
    // ConnectionHandler.hola();
    
};

UIv1.movePlayer = () => {
    ConnectionHandler.movePlayer();
    console.log("movePlayer en  UIv1");
};























// Función para girar el jugador
// UIv1.rotatePlayer = () => {
//     player.direction = (player.direction + 90) % 360;
//     console.log("Nueva dirección del jugador:", player.direction);

// }







// // Función para mover el jugador
// UIv1.movePlayer = () => {

//     switch (player.direction) {
//         case 0: // arriba
//             newPos.y -= 1;
//             break;
//         case 90: // derecha
//             newPos.x += 1;
//             break;
//         case 180: // izquierda
//             newPos.y += 1;
//             break;
//         case 270: // abajo
//             newPos.x -= 1;
//             break;
//     }

//     // Verificar que la nueva posición esté dentro de los límites del tablero
//     if (newPos.x >= 0 && newPos.x < board.length && newPos.y >= 0 && newPos.y < board[0].length) {
//         player.position = newPos;
//         console.log("Nueva posición del jugador:", player.position);
//          UIv1.drawBoard(board); // Redibujar el tablero con la nueva posición del jugador
//     } else {
//         console.log("Movimiento inválido: el jugador no puede salir del tablero");
//     }
// }