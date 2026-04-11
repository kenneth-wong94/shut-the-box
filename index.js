const screenIDs = {
  menu: "mainmenu-screen",
  rules: "rules-screen",
  game: "game-screen",
};

const menuScreen = document.getElementById(screenIDs.menu);
const rulesScreen = document.getElementById(screenIDs.rules);
const gameScreen = document.getElementById(screenIDs.game);

const startGameBtn = document.querySelector("#start-game-btn");
const rulesBtn = document.querySelector("#rules-btn");
const diceBtn = document.querySelector("#dice-btn");
const dice1 = document.querySelector("#dice-1");
const dice2 = document.querySelector("#dice-2");
const sumText = document.querySelector("#sum");
const tiles = document.querySelectorAll(".tiles");
const submitBtn = document.querySelector(".submit-btn");
const messageInput = document.querySelector("#message-el");
const errorMessage = document.querySelector("#error-message");
const restartBtn = document.querySelector("#restart-btn");
const mainMenuBtn = document.querySelector("#main-menu-btn");

let board = [];
let isRunning = false;
let isWinner = false;
let sum = "";
let dice1Value = "";
let dice2Value = "";

initializeGame();

function initializeGame() {
  isRunning = true;
  isWinner = false;
  sum = "";
  dice1Value = "";
  dice2Value = "";
  board = [];
  errorMessage.innerText = "";
}

function showScreen(screenName) {
  const screens = [menuScreen, rulesScreen, gameScreen];
  const activeScreen = document.getElementById(screenIDs[screenName]);

  screens.forEach((screen) => {
    screen.classList.toggle("active", screen === activeScreen);
  });
}

startGameBtn.addEventListener("click", () => {
  showScreen("game");
});

rulesBtn.addEventListener("click", () => {
  showScreen("rules");
});

restartBtn.addEventListener("click", () => {
  showScreen("menu");
});

mainMenuBtn.addEventListener("click", () => {
  showScreen("menu");
});

function rollDice() {
  selectTiles = true;
  dice1Value = Math.ceil(Math.random() * 6);
  dice2Value = Math.ceil(Math.random() * 6);

  sum = dice1Value + dice2Value;

  dice1.src = `images/inverted-dice-${dice1Value}.png`;
  dice2.src = `images/inverted-dice-${dice2Value}.png`;
  sumText.innerText = `You rolled ${sum}`;

  if (dice1Value === dice2Value && sum > 9) {
    messageInput.innerText = `Select ${dice1Value}`;
  } else if (sum > 9) {
    messageInput.innerText = `Select either ${dice1Value} or ${dice2Value}`;
  } else if (dice1Value === dice2Value && sum <= 9)
    messageInput.innerText = `Select either ${dice1Value} or ${sum}`;
  else {
    messageInput.innerText = `Select either ${dice1Value}/${dice2Value} or ${sum}`;
  }

  diceBtn.disabled = true;
  submitBtn.disabled = false;
  board = [];
  checkValidMoves();
}

diceBtn.addEventListener("click", rollDice);

tiles.forEach((tile) => {
  tile.addEventListener("click", updateTile);
});

function updateTile(e) {
  const value = Number(e.target.innerText);

  if (board.includes(value)) {
    board.splice(board.indexOf(value), 1);
    e.target.classList.remove("selected");
    return;
  }

  if (e.target.classList.contains("disabled")) return;

  board.push(value);
  e.target.classList.add("selected");
}

submitBtn.addEventListener("click", submitSelection);

function submitSelection() {
  const total = board.reduce((sum, num) => sum + num, 0);

  if (total === sum || total === dice1Value || total === dice2Value) {
    tiles.forEach((tile) => {
      const value = Number(tile.innerText);
      if (board.includes(value)) {
        tile.classList.add("disabled");
        messageInput.innerText = "Roll the dice again!";
        sumText.innerText = "";
        submitBtn.disabled = true;
      }
    });
    checkWinner();

    errorMessage.innerText = "";
    board.length = 0;
    diceBtn.disabled = false;
  } else {
    errorMessage.innerText = "Please select valid tiles!";
    board = [];
    tiles.forEach((tile) => {
      tile.classList.remove("selected");
    });
  }
}

function checkWinner() {
  if (valueOfRemainingTiles() === 0) {
    messageInput.innerText = "Your a winner!";
    isWinner = true;
    return;
  }
}

function checkValidMoves() {
  remaining = remainingTilesArr();

  const checkMove =
    remaining.includes(dice1Value) ||
    remaining.includes(dice2Value) ||
    remaining.includes(sum);

  if (!checkMove) {
    messageInput.innerText = `You failed to shut the box. Better luck next time!`;
    errorMessage.innerText = `Your score is: ${valueOfRemainingTiles()}`;
    sumText.innerText = "";
    submitBtn.disabled = true;
  }
}

function remainingTilesArr() {
  return Array.from(tiles)
    .filter((tile) => !tile.classList.contains("disabled"))
    .map((tile) => Number(tile.innerText));
}

function valueOfRemainingTiles() {
  return remainingTilesArr().reduce((total, ele) => {
    return total + ele;
  }, 0);
}
