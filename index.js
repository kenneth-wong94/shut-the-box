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
const multiplayerBtn = document.querySelector("#multiplayer-btn");
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
const topMessage = document.querySelector(".top-message");

let selectedTilesArr = [];
let sum = 0;
let dice1Value = 0;
let dice2Value = 0;
let selectTiles = false;
let board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let multiPlayer = false;
let player1 = {
  name: "Player 1",
  score: 0,
};
let player2 = {
  name: "Player 2",
  score: 0,
};
let currentPlayer = player1;

initializeGame();

function showScreen(screenName) {
  const screens = [menuScreen, rulesScreen, gameScreen];
  const activeScreen = document.getElementById(screenIDs[screenName]);

  screens.forEach((screen) => {
    screen.classList.toggle("active", screen === activeScreen);
  });
}

function switchTurn() {
  currentPlayer = currentPlayer === player1 ? player2 : player1;
}

function initializeGame() {
  sum = 0;
  dice1Value = 0;
  dice2Value = 0;
  player1.score = 0;
  player2.score = 0;
  currentPlayer = player1;

  renderGame();
}

function renderGame() {
  submitBtn.disabled = true;
  diceBtn.disabled = false;
  selectTiles = false;
  errorMessage.innerText = "";
  selectedTilesArr = [];
  board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  dice1.src = `images/inverted-dice-1.png`;
  dice2.src = `images/inverted-dice-1.png`;
  sumText.innerText = "Roll results";
  messageInput.innerText = "Roll the dice to start!";

  tiles.forEach((tile) => {
    tile.classList.remove("disabled");
    tile.classList.remove("selected");
  });

  if (multiPlayer) {
    topMessage.innerText = `${currentPlayer.name}'s turn`;
  }
}

function rollDice() {
  selectTiles = false;
  diceBtn.disabled = true;
  submitBtn.disabled = true;
  messageInput.innerText = "";
  errorMessage.innerText = "";

  let rollInterval = setInterval(() => {
    let roll1 = Math.ceil(Math.random() * 6);
    let roll2 = Math.ceil(Math.random() * 6);

    dice1.src = `images/inverted-dice-${roll1}.png`;
    dice2.src = `images/inverted-dice-${roll2}.png`;
  }, 30);

  setTimeout(() => {
    clearInterval(rollInterval);

    dice1Value = Math.ceil(Math.random() * 6);
    dice2Value = Math.ceil(Math.random() * 6);
    sum = dice1Value + dice2Value;

    selectTiles = true;
    submitBtn.disabled = false;
    selectedTilesArr = [];

    renderDice();
    checkValidMoves();
  }, 500);
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

    checkMultiPlayerMode(0);
  }
}

function checkValidMoves() {
  const validMove =
    board.includes(dice1Value) ||
    board.includes(dice2Value) ||
    board.includes(sum);

  if (!validMove) {
    const score = valueOfRemainingTiles();
    messageInput.innerText = `${currentPlayer.name} failed to shut the box. Better luck next round!`;
    errorMessage.innerText = `Your score is: ${score}`;
    sumText.innerText = "";
    submitBtn.disabled = true;
    selectTiles = false;

    checkMultiPlayerMode(score);
  }
}

function checkMultiPlayerMode(score) {
  if (multiPlayer) {
    if (currentPlayer === player1) {
      currentPlayer.score = score;
      switchTurn();

      setTimeout(() => {
        renderGame();
        topMessage.innerText = `${currentPlayer.name}'s turn`;
      }, 3000);
    } else {
      currentPlayer.score = score;
      setTimeout(() => {
        declareWinner();
      }, 3000);
    }
  }
}

function declareWinner() {
  diceBtn.disabled = true;
  submitBtn.disabled = true;

  if (player1.score < player2.score) {
    messageInput.innerText = `player 1 is the winner with a score of ${player1.score}!`;
    errorMessage.innerText = `player 1 score: ${player1.score} , player 2 score: ${player2.score}`;
  } else if (player1.score > player2.score) {
    messageInput.innerText = `player 2 is the winner with a score of ${player2.score}!`;
    errorMessage.innerText = `player 1 score: ${player1.score} , player 2 score: ${player2.score}`;
  } else {
    messageInput.innerText = `Its a tie!`;
    errorMessage.innerText = `player 1 score: ${player1.score} , player 2 score: ${player2.score}`;
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
  multiPlayer = false;
  topMessage.innerText = "";
  initializeGame();
  showScreen("game");
});

backBtn.addEventListener("click", () => {
  showScreen("menu");
});

rulesBtn.addEventListener("click", () => {
  showScreen("rules");
});

multiplayerBtn.addEventListener("click", () => {
  showScreen("game");
  currentPlayer = player1;
  multiPlayer = true;
  initializeGame();
});

mainMenuBtn.addEventListener("click", () => {
  multiPlayer = false;
  showScreen("menu");
});
