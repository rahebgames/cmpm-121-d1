import eggSprite from "./sprites/egg.png";
import "./style.css";

// main currency
let xp: number = 0;

document.body.innerHTML = `
  <div class="monster-flexbox">
    <div class="monster-wrapper">
      <p id="xp">XP: <span id="counter">0</span></p>
      <button id="monster" type="button"><img src="${eggSprite}" class="icon" /></button>
    </div>
  </div>
`;

const monster = document.getElementById("monster")!;
const counterElement = document.getElementById("counter")!;

monster.addEventListener("click", () => {
  xp += 1;
  counterElement.innerHTML = String(xp);
});
