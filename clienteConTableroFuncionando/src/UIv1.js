import { UI_BUILDER } from "./Ui.js";
import { Player } from "./entities/Player.js";
import { ConnectionHandler } from "./services/ConnectionHandler.js";

export const UIv1 = UI_BUILDER.init();


UIv1.initUI = () => {
    const base = document.getElementById(UIv1.uiElements.board);
    base.classList.add("board");

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const rotateButton = document.createElement("button");
    rotateButton.innerText = "Girar";
    rotateButton.addEventListener("click", UIv1.rotatePlayer);
    buttonContainer.appendChild(rotateButton);

    const moveButton = document.createElement("button");
    moveButton.innerText = "Avanzar";
    moveButton.addEventListener("click", UIv1.movePlayer);
    buttonContainer.appendChild(moveButton);

    const shootButton = document.createElement("button");
    shootButton.innerText = "Disparar";
    shootButton.addEventListener("click", UIv1.shoot);
    buttonContainer.appendChild(shootButton);
 
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

UIv1.drawPlayers = (players) => {
    const base = document.getElementById(UIv1.uiElements.board);
    const tiles = base.getElementsByClassName("tile");

    players.forEach(player => {
        const index = player.x * 10 + player.y; 
        if (tiles[index]) {
            tiles[index].classList.add("player"); 
        }
    });
};

UIv1.drawBoard();


UIv1.rotatePlayer = () => {

    Player.direction = (Player.direction + 1) % 4;  
    console.log("La dirección es: ", Player.direction);


    ConnectionHandler.updateDirection(Player.direction);
    // ConnectionHandler.hola();
    
};

UIv1.movePlayer = () => {
    ConnectionHandler.movePlayer();
    console.log("movePlayer en  UIv1");
};


