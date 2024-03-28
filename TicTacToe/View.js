class View extends EventEmitter {
  constructor() {
    super();
    this.app = document.querySelector(".app");
    this.audio = document.querySelector(".audio-container__audio");
    this.btnAudio = document.querySelector(".audio-container__btn");
    this.btnNewGame = document.querySelector(".new-game__btn");
    this.arena = document.querySelector(".arena");
    this.board = document.querySelector(".board");
    this.modalName = document.querySelector(".modal__playername");
    this.modalOpponentName = document.querySelector(".modal__opponent-name");
    this.modalChooseOpponent = document.querySelector(".modal__opponent");
    this.playerName = document.querySelector(".player-name__placeholder");
    this.playerNameBtn = document.querySelector(".player-name__btn");
    this.opponentName = document.querySelector(".opponent-name__placeholder");
    this.btnOpponent = document.querySelectorAll(".modal__opponent__btn");
    this.opponentNameBtn = document.querySelector(".opponent-name__btn");
    this.playerNamePlace = document.querySelector(".first-player");
    this.secondPlayerNamePlace = document.querySelector(".second-player");
    this.gameWrapper = document.querySelector(".game-wrapper");
    this.modalWinner = document.querySelector(".modal__winner");
    this.modalDraw = document.querySelector(".modal__draw");
    this.playerScore = document.querySelectorAll(".player__container-score");
    this.playerContainer = document.querySelectorAll(".player__container");

    this.handleSetOpponent = this.handleSetOpponent.bind(this);
    this.handleWinEvents = this.handleWin.bind(this);
  }

  renderArena() {
    for (let i = 1; i <= 9; i++) {
      this.arena.innerHTML += `<div class = 'cell' position = '${i}' ></div>`;
    }
    this.cells = document.querySelectorAll(".cell");
    this.emit("cellsLoaded");
  }

  handleSetOpponent(opponent) {
    if (opponent === "bot") {
      this.modalChooseOpponent.classList.add("hide");
      this.gameWrapper.classList.remove("hide");
      this.secondPlayerNamePlace.textContent = "darth vader";
    }
    if (opponent === "player") {
      this.modalOpponentName.classList.remove("hide");
      this.modalChooseOpponent.classList.add("hide");
    }
  }

 handleWin(wonCombination, currentPlayer, opponent) {

   if (
     opponent === "bot" &&
     currentPlayer.classList.contains("second-player")
   ) {
     this.modalWinner.style.backgroundImage = "url(./assets/img/botWin.gif)";
     this.modalWinner.classList.remove("hide");
   } else if (
     opponent === "bot" &&
     currentPlayer.classList.contains("first-player")
   ) {
     this.modalWinner.style.backgroundImage = "url(./assets/img/botLose.gif)";
     this.modalWinner.classList.remove("hide");
   } else if (
     opponent === "player"
   ) {
     this.modalWinner.style.backgroundImage = "url(./assets/img/winner.gif)";
     this.modalWinner.classList.remove("hide");
   }
     this.playerContainer.forEach((player) => {
       player.classList.remove("clicked");
     });
   this.cells.forEach((cell) => {
     if (wonCombination.includes(+cell.getAttribute("position"))) {
       cell.classList.add("light");
     }
   });

   setTimeout(() => {
     this.modalWinner.classList.add("hide");
   }, 3450);

  }

  handleDraw() {
    this.playerNamePlace.classList.remove("clicked");
    this.secondPlayerNamePlace.classList.remove("clicked");
    this.modalDraw.classList.remove("hide");

       setTimeout(() => {
         this.modalDraw.classList.add("hide");
       }, 3450);
  }

  scoresCounter(currentPlayer) {
    let playerScore = currentPlayer.nextElementSibling;
    let currentScore = +playerScore.textContent;
    playerScore.textContent = currentScore + 1;
  }
}
