class Model {
  constructor() {
    this.player1 = [];
    this.player2 = [];
    this.selectedCellsArr = [];
    this.opponent = null;
    this.isWinner = false;
    this.isDraw = false;
    this.isAudioPlaying = false;
    this.turn = null;
    this.winsVariations = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [3, 5, 7],
    ];
  }

  checkWinner() {
    let currentPlayerResArr = this.turn ? this.player1 : this.player2;
    for (let i of this.winsVariations) {
      const [a, b, c] = i;
      if (
        currentPlayerResArr.includes(a) &&
        currentPlayerResArr.includes(b) &&
        currentPlayerResArr.includes(c)
      ) {
        this.isWinner = true;
        return [a, b, c];
      }
      else if (this.selectedCellsArr.length === 9 && !this.isWinner) {
        this.isDraw = true;
      }
    }
  }



}
