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
board = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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
  board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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
  diceBtn.disabled = true;
  submitBtn.disabled = false;
  selectedTilesArr = [];

  renderDice();
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

  if (!board.includes(value)) return;

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
        board = board.filter((num) => !selectedTilesArr.includes(num));
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

    dice1.src =
      "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdm50ZmZ6dXRhaWppY3h0eXdxbHl2a2VhOWJ0N2U5NTJrdHprb2VxbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/jZBNTtZPbRlr52dOUt/giphy.gif";
    dice2.src =
      "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdm50ZmZ6dXRhaWppY3h0eXdxbHl2a2VhOWJ0N2U5NTJrdHprb2VxbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/jZBNTtZPbRlr52dOUt/giphy.gif";
  }
}

function checkValidMoves() {
  const validMove =
    board.includes(dice1Value) ||
    board.includes(dice2Value) ||
    board.includes(sum);

  if (!validMove) {
    messageInput.innerText = `You failed to shut the box. Better luck next round!`;
    errorMessage.innerText = `Your score is: ${valueOfRemainingTiles()}`;
    sumText.innerText = "";
    submitBtn.disabled = true;
    selectTiles = false;
  }
}

function valueOfRemainingTiles() {
  return board.reduce((total, ele) => {
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
