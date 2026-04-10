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

const values = [];
const imagesArr = [];

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
  let randomDiceIdx = Math.ceil(Math.random() * 6);
  let randomDiceIdx1 = Math.ceil(Math.random() * 6);
  let sum = "";

  let dice1Value = randomDiceIdx;
  let dice2Value = randomDiceIdx1;

  sum = dice1Value + dice2Value;
  console.log(sum);
  dice1.src = `images/inverted-dice-${dice1Value}.png`;
  dice2.src = `images/inverted-dice-${dice2Value}.png`;
}

rollDice();
