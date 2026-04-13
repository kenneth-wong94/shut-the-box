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
const backBtn = document.querySelector("#back-btn");

let selectedTilesArr = [];
let sum = 0;
let dice1Value = 0;
let dice2Value = 0;
let selectTiles = false;

initializeGame();

function showScreen(screenName) {
  const screens = [menuScreen, rulesScreen, gameScreen];
  const activeScreen = document.getElementById(screenIDs[screenName]);

  screens.forEach((screen) => {
    screen.classList.toggle("active", screen === activeScreen);
  });
}

function initializeGame() {
  sum = 0;
  dice1Value = 0;
  dice2Value = 0;
  selectedTilesArr = [];
  renderGame();
}

function renderGame() {
  submitBtn.disabled = true;
  diceBtn.disabled = false;
  selectTiles = false;
  errorMessage.innerText = "";
  dice1.src = `images/inverted-dice-1.png`;
  dice2.src = `images/inverted-dice-1.png`;
  sumText.innerText = "Roll results";
  messageInput.innerText = "Roll the dice to start!";

  tiles.forEach((tile) => {
    tile.classList.remove("disabled");
    tile.classList.remove("selected");
  });
}

function rollDice() {
  selectTiles = true;
  dice1Value = Math.ceil(Math.random() * 6);
  dice2Value = Math.ceil(Math.random() * 6);

  sum = dice1Value + dice2Value;

  renderDice();

  diceBtn.disabled = true;
  submitBtn.disabled = false;
  selectedTilesArr = [];
  checkValidMoves();
}

function renderDice() {
  dice1.src = `images/inverted-dice-${dice1Value}.png`;
  dice2.src = `images/inverted-dice-${dice2Value}.png`;
  sumText.innerText = `You rolled ${sum}`;

  if (dice1Value === dice2Value && sum > 9) {
    messageInput.innerText = `Select ${dice1Value}`;
  } else if (sum > 9) {
    messageInput.innerText = `Select ${dice1Value} & ${dice2Value}`;
    errorMessage.innerText = `You may even select a tile of ${dice1Value} or ${dice2Value}`;
  } else if (dice1Value === dice2Value && sum <= 9)
    messageInput.innerText = `Select either ${dice1Value} or ${sum}`;
  else {
    messageInput.innerText = `Select either ${dice1Value} & ${dice2Value} or ${sum}`;
    errorMessage.innerText = `You may even select a tile of ${dice1Value} or ${dice2Value}`;
  }
}

function updateTile(e) {
  const value = Number(e.target.innerText);
  if (!selectTiles) return;

  if (selectedTilesArr.includes(value)) {
    selectedTilesArr.splice(selectedTilesArr.indexOf(value), 1);
    e.target.classList.remove("selected");
    return;
  }

  if (selectedTilesArr.length >= 2) return;

  if (e.target.classList.contains("disabled")) return;

  selectedTilesArr.push(value);
  e.target.classList.add("selected");
}

function submitSelection() {
  const total = selectedTilesArr.reduce((sum, num) => sum + num, 0);

  if (total === sum || total === dice1Value || total === dice2Value) {
    tiles.forEach((tile) => {
      const value = Number(tile.innerText);
      if (selectedTilesArr.includes(value)) {
        messageInput.innerText = "Roll the dice again!";
        sumText.innerText = "Roll results";
        tile.classList.add("disabled");
        selectTiles = false;
        submitBtn.disabled = true;
        diceBtn.disabled = false;
        errorMessage.innerText = "";
      }
    });
    checkWinner();
  } else {
    errorMessage.innerText = "Please select valid tiles!";
    selectedTilesArr = [];

    tiles.forEach((tile) => {
      tile.classList.remove("selected");
    });
  }
}

function checkWinner() {
  if (valueOfRemainingTiles() === 0) {
    messageInput.innerText = "Congrats, You have successfully shut the box!!";
    diceBtn.disabled = true;
    errorMessage.innerText = "-Perfect score-";
  }
}

function checkValidMoves() {
  remaining = remainingTilesArr();

  const validMove =
    remaining.includes(dice1Value) ||
    remaining.includes(dice2Value) ||
    remaining.includes(sum);

  if (!validMove) {
    messageInput.innerText = `You failed to shut the box. Better luck next round!`;
    errorMessage.innerText = `Your score is: ${valueOfRemainingTiles()}`;
    sumText.innerText = "";
    submitBtn.disabled = true;
    selectTiles = false;
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

tiles.forEach((tile) => {
  tile.addEventListener("click", updateTile);
});

submitBtn.addEventListener("click", submitSelection);
restartBtn.addEventListener("click", initializeGame);
diceBtn.addEventListener("click", rollDice);

startGameBtn.addEventListener("click", () => {
  showScreen("game");
});

backBtn.addEventListener("click", () => {
  showScreen("menu");
});

rulesBtn.addEventListener("click", () => {
  showScreen("rules");
});

mainMenuBtn.addEventListener("click", () => {
  showScreen("menu");
});
