import eggSprite from "./sprites/egg.png";
import "./style.css";

// main currency
let xp: number = 0;
let growth_rate = 0;
let upgrade_cost = 10;

document.body.innerHTML = `
  <div class="monster-flexbox">
    <div class="monster-wrapper">
      <p id="xp">XP: <span id="counter">0</span></p>
      <button id="monster-button" type="button"><img src="${eggSprite}" class="icon" /></button>
      <button id="upgrade">Buy Auto Clicker: ${upgrade_cost}</button>
    </div>
  </div>
`;

const MONSTER = document.getElementById("monster-button")! as HTMLButtonElement;
const COUNTER_ELEMENT = document.getElementById("counter")! as HTMLSpanElement;
const UPGRADE_BUTTON = document.getElementById("upgrade")! as HTMLButtonElement;

UPGRADE_BUTTON.disabled = true;

requestAnimationFrame(autoClick);

MONSTER.addEventListener("click", () => {
  xp += 1;
  COUNTER_ELEMENT.innerHTML = String(xp);
});

UPGRADE_BUTTON.addEventListener("click", () => {
  xp -= upgrade_cost;
  upgrade_cost *= 1.2;
  growth_rate++;
  UPGRADE_BUTTON.innerHTML = "Buy Auto Clicker: " +
    String(Math.floor(upgrade_cost));
});

let lastTimestamp: number | null = null;
function autoClick(timestamp: DOMHighResTimeStamp) {
  if (lastTimestamp == null) lastTimestamp = timestamp;

  const DELTA_SECONDS = (timestamp - lastTimestamp) / 1000;
  xp += DELTA_SECONDS * growth_rate;
  COUNTER_ELEMENT.innerHTML = xp.toFixed(2);

  if (xp >= upgrade_cost) {
    UPGRADE_BUTTON.disabled = false;
  } else {
    UPGRADE_BUTTON.disabled = true;
  }

  lastTimestamp = timestamp;
  requestAnimationFrame(autoClick);
}
