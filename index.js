const screenIDs = {
  menu: "mainmenu-screen",
  rules: "rules-screen",
  game: "game-screen",
  result: "result-screen",
};

const menuScreen = document.getElementById(screenIDs.menu);
const rulesScreen = document.getElementById(screenIDs.rules);
const gameScreen = document.getElementById(screenIDs.game);
const resultScreen = document.getElementById(screenIDs.result);

const startGameBtn = document.querySelector("#start-game-btn");
const rulesBtn = document.querySelector("#rules-btn");
const diceBtn = document.querySelector("#dice-btn");
const dice1 = document.querySelector("#dice-1");
const dice2 = document.querySelector("#dice-2");
const sumText = document.querySelector("#sum");
const tiles = document.querySelectorAll(".tiles");
const submitBtn = document.querySelector(".submit-btn");
const messageInput = document.querySelector("#message-el");

let board = [];
let isRunning = false;
let isWinner = false;
let sum = "";

initializeGame();

function initializeGame() {
  isRunning = true;
  isWinner = false;
}

function showScreen(screenName) {
  const screens = [menuScreen, rulesScreen, gameScreen, resultScreen].filter(
    Boolean,
  );
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

function rollDice() {
  let dice1Value = Math.ceil(Math.random() * 6);
  let dice2Value = Math.ceil(Math.random() * 6);

  sum = dice1Value + dice2Value;

  dice1.src = `images/inverted-dice-${dice1Value}.png`;
  dice2.src = `images/inverted-dice-${dice2Value}.png`;
  sumText.innerText = `You rolled ${sum}`;

  diceBtn.disabled = true;
  submitBtn.disabled = false;
  board = [];
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

  if (total === sum) {
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
    checkValidMoves();
    board.length = 0;
    diceBtn.disabled = false;
  } else {
    messageInput.innerText = "Please select valid tiles!";
    board = [];
    tiles.forEach((tile) => {
      tile.classList.remove("selected");
    });
  }
}

function checkWinner() {
  const remainingTiles = Array.from(tiles)
    .filter((tile) => !tile.classList.contains("disabled"))
    .map((tile) => Number(tile.innerText));

  const valueOfRemainingTiles = remainingTiles.reduce((total, ele) => {
    return total + ele;
  }, 0);

  if (valueOfRemainingTiles === 0) {
    messageInput.innerText = "Your a winner!";
    return true;
  }
  return false;
}

function checkValidMoves() {}
