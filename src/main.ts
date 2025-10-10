import eggSprite from "./sprites/egg.png";
import "./style.css";

// main currency
let xp: number = 0;

document.body.innerHTML = `
  <div class="monster-flexbox">
    <div class="monster-wrapper">
      <p id="xp">XP: <span id="counter">0</span></p>
      <button id="monster-button" type="button"><img src="${eggSprite}" class="icon" /></button>
    </div>
  </div>
`;

const MONSTER = document.getElementById("monster-button")!;
const COUNTER_ELEMENT = document.getElementById("counter")!;
const _INTERVAL_ID = setInterval(autoClick, 1000);

MONSTER.addEventListener("click", () => {
  xp += 1;
  COUNTER_ELEMENT.innerHTML = String(xp);
});

function autoClick() {
  xp += 1;
  COUNTER_ELEMENT.innerHTML = String(xp);
}
