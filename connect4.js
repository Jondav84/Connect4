/** @format */

// /** @format */

// // create the game class
class Game {
  //create constructor for the class
  constructor(p1, p2, HEIGHT = 6, WIDTH = 7) {
    //set the players list
    this.players = [p1, p2];
    //set the game board dimensions
    this.height = HEIGHT;
    this.width = WIDTH;
    //set the starting player to player 1
    this.currentPlayer = p1;
    //adding the methods to the class
    this.makeBoard();
    this.makeHTMLBoard();
    //set a boolean to determine the status of the game
    this.gameOver = false;
  }
  /** make board
    creates the structure of the board in js
    */
  makeBoard() {
    //an Array of Rows
    this.board = [];
    //fill in the array with arrays of cells
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }
  /** make html board
    creates the gameboard in html
    */
  makeHTMLBoard() {
    const board = document.getElementById("board");
    board.innerHTML = " ";
    //make column tops - area for column selection to add game peice to
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    /** store a reference to handleClick bound function
         so that we can remove the event listener correctly */
    this.handleGameClick = this.handleClick.bind(this);
    //add the click event listener
    top.addEventListener("click", this.handleGameClick);
    //creates the individual cells for the clickable areas
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }
    //adding the tables top elements to the HTML element
    board.append(top);
    //make the main part of the board
    //for loop create a  number of row elements based on the height attribute
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");
      //for loop to create a number of cells for each row based on the width attribute
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        //add each cell to the row
        row.append(cell);
      }
      //add row to the game board
      board.append(row);
    }
  }
  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    //for loop to go through each cell in a column starting from the bottom and working through to the top
    for (let y = this.height - 1; y >= 0; y--) {
      //checkds to see if the cell is empty
      if (!this.board[y][x]) {
        // it returns the value of y
        return y;
      }
    }
    // else it returns null
    return null;
  }
  /** placeInTable: update DOM to place piece into HTML board */
  placeInTable(y, x) {
    //create a new html element
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.backgroundColor = this.currentPlayer.color;
    piece.style.top = -50 * (y + 2);
    //add te new div to the cell
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  /** announces the game over with results */
  endGame(msg) {
    setTimeout(() => {
      alert(msg);
    }, 500);
    //remove eventlistener from the board
    const top = document.querySelector("#column-top");
    top.removeEventListener("click", this.handleGameClick);
  }
  /** handleClick: handle click on column top to play a piece */
  handleClick(e) {
    //get x from ID of the clicked cell
    const x = +e.target.id;
    //get next spot in column(if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
    //place piece on oard and add to html table
    this.board[y][x] = this.currentPlayer;
    this.placeInTable(y, x);
    //check for tie
    if (this.board.every((row) => row.every((cell) => cell))) {
      return this.endGame("Tie!");
    }
    //check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`The ${this.currentPlayer.color} player won!`);
    }
    // switch players
    this.currentPlayer =
      this.currentPlayer === this.players[0]
        ? this.players[1]
        : this.players[0];
  }
  /**checkForWin: check the board cell by cell for "does a win start here?" */
  checkForWin() {
    /** Check four cells to see if they are all the color of the current player
     * -cells: list of four (y, x) cells
     * -returns true if all are legal coordinates and match currentPlayer
     */
    const _win = (cells) =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currentPlayer
      );
    //nested for loop to run throught each cell
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        //get checklist of 4 cells for each way to win
        const horizontal = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vertical = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagonalRight = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagonalLeft = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];
        //find winner (only checking each win possibility as needed)
        if (
          _win(horizontal) ||
          _win(vertical) ||
          _win(diagonalRight) ||
          _win(diagonalLeft)
        ) {
          // Highlight the winning cells
          if (_win(horizontal)) {
            for (let i = 0; i < 4; i++) {
              const [winY, winX] = horizontal[i];
              const winCell = document.getElementById(`${winY}-${winX}`);
              winCell.classList.add("win-cell");
            }
          } else if (_win(vertical)) {
            for (let i = 0; i < 4; i++) {
              const [winY, winX] = vertical[i];
              const winCell = document.getElementById(`${winY}-${winX}`);
              winCell.classList.add("win-cell");
            }
          } else if (_win(diagonalRight)) {
            for (let i = 0; i < 4; i++) {
              const [winY, winX] = diagonalRight[i];
              const winCell = document.getElementById(`${winY}-${winX}`);
              winCell.classList.add("win-cell");
            }
          } else if (_win(diagonalLeft)) {
            for (let i = 0; i < 4; i++) {
              const [winY, winX] = diagonalLeft[i];
              const winCell = document.getElementById(`${winY}-${winX}`);
              winCell.classList.add("win-cell");
            }
          }
          return true;
        }
      }
    }
  }
}
//player class with contructor to give it a color attribute
class Player {
  constructor(color) {
    this.color = color;
  }
}
//adds event listener to the start new game button
document.getElementById("start-game").addEventListener("click", () => {
  //creates the players giving them a color attribute based on the corrisponing inputs
  let p1 = new Player(document.getElementById("p1-color").value);
  let p2 = new Player(document.getElementById("p2-color").value);
  //creates a new game with the p1- p2 as args
  new Game(p1, p2);
});
