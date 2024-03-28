class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.initializeGame();

    this.view.on("cellsLoaded", this.clickHandler.bind(this));
  }

  initializeGame() {
    this.view.renderArena();
    this.addEventListeners();
  }

  addEventListeners() {
    this.view.modalName.addEventListener(
      "submit",
      this.getPlayerName.bind(this)
    );

    this.view.btnOpponent.forEach((btn) => {
      btn.addEventListener("click", this.setOpponent.bind(this));
    });

    this.view.btnAudio.addEventListener("click", this.audioSettings.bind(this));

    this.view.modalOpponentName.addEventListener(
      "submit",
      this.getOpponentName.bind(this)
    );

    this.view.btnNewGame.addEventListener("click", this.newGame.bind(this));
    this.view.arena.addEventListener("click", this.clickHandler.bind(this));
  }

  getPlayerName(e) {
    e.preventDefault();
    if (this.view.playerName.value.trim()) {
      this.view.playerNamePlace.textContent = this.view.playerName.value;
      this.view.playerName.value = "";
      this.view.modalName.classList.add("hide");
      this.view.modalChooseOpponent.classList.remove("hide");
    }
  }

  getRandomTurn() {
    const randomPlayer = Math.floor(Math.random() * 2);
    if (randomPlayer > 0.5) this.model.turn = false;
    else this.model.turn = true;
    this.currentPlayer = this.model.turn
      ? this.view.playerNamePlace
      : this.view.secondPlayerNamePlace;

    this.currentPlayer.parentNode.classList.add("clicked");
  }

  setOpponent(e) {
    const opponent = e.target.value;
    this.view.handleSetOpponent(opponent);
    this.getRandomTurn();
    this.model.opponent = opponent;
    if (opponent === "bot") {
      this.aiPlayer(e);
      this.view.btnNewGame.classList.remove("hide");
    }
  }

  getOpponentName(e) {
    e.preventDefault();
    if (this.view.opponentName.value.trim()) {
      this.view.secondPlayerNamePlace.textContent =
        this.view.opponentName.value;
      this.view.modalOpponentName.classList.add("hide");
      this.view.gameWrapper.classList.remove("hide");
      this.view.btnNewGame.classList.remove("hide");
    }
  }

  clickHandler(e) {
    const position = e.target.getAttribute("position");
    let selectedCell = e.target;
    const numberOfSelectedCell = +selectedCell.getAttribute("position");
    const currentPlayerResArr = this.model.turn
      ? this.model.player1
      : this.model.player2;
    const currentPlayer = this.model.turn
      ? this.view.playerNamePlace
      : this.view.secondPlayerNamePlace;
    const notCurrentPlayer = this.model.turn
      ? this.view.secondPlayerNamePlace
      : this.view.playerNamePlace;

    const symbol = this.model.turn
      ? "url(./assets/icons/yoda.png)"
      : "url(./assets/icons/stormtooper.png)";

    const isBotTurn = this.model.turn && this.model.opponent === "bot";
    const isGameNotOver = !this.model.isWinner && !this.model.isDraw;

    if (!selectedCell.classList.contains("selected")) {
      selectedCell.style.backgroundImage = symbol;
      selectedCell.classList.add("selected");
      currentPlayerResArr.push(+position);
      this.model.selectedCellsArr.push(numberOfSelectedCell);

      this.updateGameState(e, currentPlayer, notCurrentPlayer);
    }
    if (isBotTurn && isGameNotOver && this.model.selectedCellsArr.length) {
      this.aiPlayer(e);
    }
  }

  async aiPlayer(e) {
    const currentPlayerResArr = this.model.turn
      ? this.model.player1
      : this.model.player2;
    const symbol = this.model.turn
      ? "url(./assets/icons/yoda.png)"
      : "url(./assets/icons/stormtooper.png)";
    let randomNumber = Math.ceil(Math.random() * 9);
    const currentPlayer = this.model.turn
      ? this.view.playerNamePlace
      : this.view.secondPlayerNamePlace;
    const notCurrentPlayer = this.model.turn
      ? this.view.secondPlayerNamePlace
      : this.view.playerNamePlace;
    const isCellSelected =
      this.model.turn === false &&
      !this.model.selectedCellsArr.includes(randomNumber);

    await new Promise(() => {
      setTimeout(() => {
        if (isCellSelected) {
          this.view.cells.forEach((cell) => {
            const selectedCellAi = +cell.getAttribute("position");
            if (
              selectedCellAi === randomNumber &&
              !this.model.selectedCellsArr.includes(selectedCellAi)
            ) {
              cell.style.backgroundImage = symbol;
              cell.classList.add("selected");
              currentPlayerResArr.push(selectedCellAi);
              this.model.selectedCellsArr.push(selectedCellAi);

              this.updateGameState(e, currentPlayer, notCurrentPlayer);
            }
          });
        } else if (this.model.selectedCellsArr.includes(randomNumber)) {
          this.aiPlayer(e);
        }
      }, 500);
    });
  }

  updateGameState(e, currentPlayer, notCurrentPlayer) {
    const wonCombination = this.model.checkWinner();
    if (this.model.isWinner) {
      this.view.handleWin(wonCombination, currentPlayer, this.model.opponent);
      this.view.scoresCounter(currentPlayer);
      this.resetGame(e);
      return;
    } else {
      currentPlayer.parentNode.classList.remove("clicked");
      notCurrentPlayer.parentNode.classList.add("clicked");
      this.model.turn = !this.model.turn;
    }
    if (this.model.isDraw) {
      this.view.handleDraw();
      this.resetGame(e);
      return;
    } else {
      this.view.modalDraw.classList.add("hide");
    }
  }

  resetGame(e) {
    e.preventDefault();
    this.view.cells.forEach((cell) => {
      cell.style.backgroundImage = null;
      cell.classList.remove("light");
      cell.classList.remove("selected");
    });
    this.view.playerContainer.forEach((player) => {
      player.classList.remove("clicked");
    });
    this.model.player1 = [];
    this.model.player2 = [];
    this.model.selectedCellsArr = [];
    this.model.isWinner = false;
    this.model.isDraw = false;
    this.getRandomTurn();
    if (this.model.opponent === "bot" && this.model.turn === false) {
      setTimeout(() => {
        this.aiPlayer(e);
      }, 3500);
    }
  }

  newGame(e) {
    this.view.modalName.classList.remove("hide");
    this.view.playerContainer.forEach((player) => {
      player.classList.remove("clicked");
    });
    this.view.gameWrapper.classList.add("hide");
    this.model.player1 = [];
    this.model.player2 = [];
    this.model.selectedCellsArr = [];
    this.model.isWinner = false;
    this.model.isDraw = false;
    this.view.opponentName.value = "";
    this.view.playerScore.forEach((elem) => {
      elem.textContent = 0;
    });
    this.view.cells.forEach((cell) => {
      cell.style.backgroundImage = null;
       cell.classList.remove("selected");
    });
  }

  audioSettings(e) {
    const soundIconLink = "url(./assets/icons/sound.png)";
    const muteIconLink = "url(./assets/icons/mute.ico)";
    if (!this.model.isAudioPlaying) {
      this.view.audio.play();
      this.view.audio.preload = true;
      this.view.audio.loop = true;
      this.view.audio.volume = 0.05;
      this.model.isAudioPlaying = true;
      this.view.btnAudio.style.backgroundImage = soundIconLink;
    } else if (this.model.isAudioPlaying) {
      this.view.audio.pause();
      this.model.isAudioPlaying = false;
      this.view.btnAudio.style.backgroundImage = muteIconLink;
    }
  }
}

const model = new Model();
const view = new View();
const controller = new Controller(model, view);
