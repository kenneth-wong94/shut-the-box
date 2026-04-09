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
