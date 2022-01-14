/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {

  /*ask wehther or not its oaky to declare properties at the top*/


  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.gameOver = false;

    this.currPlayer = 1; // active player: 1 or 2
    this.board = []; // array of rows, each row is array of cells  (board[y][x])


    this.makeBoard();

    this.makeForm();
    //this.makeHtmlBoard();
    this.makeStartButton();

  }

 

  /** handles creating form elements to allow for player color submission */
  makeForm() {
    // const form = document.createElement("form");
    // form.setAttribute("type", "submit");

    const player1Color = document.createElement("input");
    player1Color.setAttribute("id", "player1Color");
    player1Color.setAttribute("placeholder", "Enter Player Color String");

    const player2Color = document.createElement("input");
    player2Color.setAttribute("id", "player2Color");
    player2Color.setAttribute("placeholder", "Enter Player Color String");

    document.querySelector("#game").append(player1Color);
    document.querySelector("#game").append(player2Color);

    // form.append(player1Color);
    // form.append(player2Color);

  }

  /** calls makeBoard and makeHtmlBoard to create game logic and HTML display */
  makeGame(evt) {
    console.log("makeGame ran")
    evt.preventDefault();

    this.player1 = new Player(1, document.querySelector("#player1Color").value);
    this.player2 = new Player(2, document.querySelector("#player2Color").value);

    console.log(document.querySelector("#player1Color").value)
    console.log(this.player1.color);
    console.log(this.player2.color);

    this.board = [];
    document.querySelector('#board').innerHTML = "";
    this.gameOver = false;

    this.currPlayer = this.player1;
    this.makeHtmlBoard();
    this.makeBoard();

    const strtBtn = document.querySelector("#startBtn");
    strtBtn.innerText = "Reset Game";

  }
  /** add start button element to page then calls makeGame() when clicked */
  makeStartButton() {
    const startBtn = document.createElement("button");
    startBtn.setAttribute("id", "startBtn");
    // startBtn.setAttribute("type", "submit");
    startBtn.innerText = "Start Game";

    startBtn.addEventListener("click", this.makeGame.bind(this));

    document.querySelector("#game").append(startBtn);
  }

   /** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */
  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');

    // console.log("this=", this)
    top.addEventListener('click', this.handleClick.bind(this));


    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer.player}`);
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
    this.gameOver = true;
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    if (this.gameOver) return;

    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    // const findSpotForColCaller = this.findSpotForCol;
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.player} won!`);
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {

    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

}

/** Player class to contain player number and color choice based on submission */
class Player {
  constructor(player, color) {
    this.player = player;
    this.color = color;
  }
}

new Game(6, 7);











