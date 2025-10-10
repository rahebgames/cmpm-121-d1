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

requestAnimationFrame(autoClick);

MONSTER.addEventListener("click", () => {
  xp += 1;
  COUNTER_ELEMENT.innerHTML = String(xp);
});

let lastTimestamp: number | null = null;
function autoClick(timestamp: DOMHighResTimeStamp) {
  if (lastTimestamp == null) lastTimestamp = timestamp;

  const DELTA_SECONDS = (timestamp - lastTimestamp) / 1000;
  xp += DELTA_SECONDS;
  COUNTER_ELEMENT.innerHTML = xp.toFixed(2);

  lastTimestamp = timestamp;
  requestAnimationFrame(autoClick);
}
