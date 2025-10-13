import eggSprite from "./sprites/egg.png";
import "./style.css";

// main currency
let xp: number = 0;
let growth_rate: number = 0;
const UPGRADES: Upgrade[] = [];

class Upgrade {
  name: string;
  cost: number;
  growth_rate: number;
  amount: number = 0;
  button: HTMLButtonElement | null = null;

  constructor(name: string, cost: number, growth_rate: number) {
    this.name = name;
    this.cost = cost;
    this.growth_rate = growth_rate;
  }

  public buy() {
    xp -= this.cost;
    this.amount++;
    this.cost *= 1.2;
    this.button!.innerHTML = `Buy ${this.name}: ${Math.floor(this.cost)}`;
  }
}

UPGRADES.push(new Upgrade("A", 10, 0.1));
UPGRADES.push(new Upgrade("B", 100, 2.0));
UPGRADES.push(new Upgrade("C", 1000, 50));

document.body.innerHTML = `
  <div class="app">
    <main class="monster-flexbox content">
      <div class="monster-wrapper">
        <p id="xp">XP: <span id="counter">0</span></p>
        <button id="monster-button" type="button"><img src="${eggSprite}" class="icon" /></button>
      </div>
    </main>

    <aside class="sidebar">
      <button class="upgrade" id="A">Buy A: ${UPGRADES[0].cost}</button>
      <button class="upgrade" id="B">Buy B: ${UPGRADES[1].cost}</button>
      <button class="upgrade" id="C">Buy C: ${UPGRADES[2].cost}</button>
    </aside>
  </div>
`;

const MONSTER = document.getElementById("monster-button")! as HTMLButtonElement;
const COUNTER_ELEMENT = document.getElementById("counter")! as HTMLSpanElement;

UPGRADES[0].button = document.getElementById("A")! as HTMLButtonElement;
UPGRADES[1].button = document.getElementById("B")! as HTMLButtonElement;
UPGRADES[2].button = document.getElementById("C")! as HTMLButtonElement;

requestAnimationFrame(autoClick);

MONSTER.addEventListener("click", () => {
  xp += 1;
  COUNTER_ELEMENT.innerHTML = String(xp);
});

for (const UPGRADE of UPGRADES) {
  UPGRADE.button!.addEventListener("click", () => {
    UPGRADE.buy();
  });
}

let lastTimestamp: number | null = null;
function autoClick(timestamp: DOMHighResTimeStamp) {
  growth_rate = 0;
  for (const UPGRADE of UPGRADES) {
    if (xp >= UPGRADE.cost) {
      UPGRADE.button!.disabled = false;
    } else {
      UPGRADE.button!.disabled = true;
    }

    growth_rate += UPGRADE.growth_rate * UPGRADE.amount;
  }

  if (lastTimestamp == null) lastTimestamp = timestamp;
  const DELTA_SECONDS = (timestamp - lastTimestamp) / 1000;
  xp += DELTA_SECONDS * growth_rate;
  COUNTER_ELEMENT.innerHTML = xp.toFixed(2);

  lastTimestamp = timestamp;
  requestAnimationFrame(autoClick);
}
