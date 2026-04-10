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

const board = [];
let isRunning = false;
let isWinner = false;
let sum = "";

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

  board.length = 0;
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

  if (board.length === 2) return;

  board.push(value);
  e.target.classList.add("selected");
}
