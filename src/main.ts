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

  buttonElement: HTMLButtonElement | null = null;
  amountElement: HTMLSpanElement | null = null;

  constructor(name: string, cost: number, growth_rate: number) {
    this.name = name;
    this.cost = cost;
    this.growth_rate = growth_rate;
  }

  public buy() {
    xp -= this.cost;
    this.amount++;
    this.cost = round(this.cost * 1.15, 2);
    this.buttonElement!.innerHTML = `Buy ${this.name}: ${this.cost}`;
    this.amountElement!.textContent = `x${this.amount}`;
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
        <p id="growth-rate">Growth rate: ${growth_rate} xp/s</p>
        <button id="monster-button" type="button"><img src="${eggSprite}" class="icon" /></button>
      </div>
    </main>

    <aside class="sidebar">
      <div class="upgrade-wrapper">
        <span class="upgrade-amount" id="A-amount">x0</span>
        <button class="upgrade" id="A">Buy A: ${UPGRADES[0].cost}</button>
      </div>
      <div class="upgrade-wrapper">
        <span class="upgrade-amount" id="B-amount">x0</span>
        <button class="upgrade" id="B">Buy B: ${UPGRADES[1].cost}</button>
      </div>
      <div class="upgrade-wrapper">
        <span class="upgrade-amount" id="C-amount">x0</span>
        <button class="upgrade" id="C">Buy C: ${UPGRADES[2].cost}</button>
      </div>
    </aside>
  </div>
`;

const MONSTER = document.getElementById("monster-button")! as HTMLButtonElement;
const COUNTER_ELEMENT = document.getElementById("counter")! as HTMLSpanElement;
const GROWTH_RATE_ELEMENT = document.getElementById(
  "growth-rate",
)! as HTMLSpanElement;

UPGRADES[0].buttonElement = document.getElementById("A")! as HTMLButtonElement;
UPGRADES[1].buttonElement = document.getElementById("B")! as HTMLButtonElement;
UPGRADES[2].buttonElement = document.getElementById("C")! as HTMLButtonElement;

UPGRADES[0].amountElement = document.getElementById(
  "A-amount",
)! as HTMLSpanElement;
UPGRADES[1].amountElement = document.getElementById(
  "B-amount",
)! as HTMLSpanElement;
UPGRADES[2].amountElement = document.getElementById(
  "C-amount",
)! as HTMLSpanElement;

requestAnimationFrame(autoClick);

MONSTER.addEventListener("click", () => {
  xp += 1;
  COUNTER_ELEMENT.innerHTML = String(xp);
});

for (const UPGRADE of UPGRADES) {
  UPGRADE.buttonElement!.addEventListener("click", () => {
    UPGRADE.buy();
  });
}

let lastTimestamp: number | null = null;
function autoClick(timestamp: DOMHighResTimeStamp) {
  growth_rate = 0;
  for (const UPGRADE of UPGRADES) {
    if (xp >= UPGRADE.cost) {
      UPGRADE.buttonElement!.disabled = false;
    } else {
      UPGRADE.buttonElement!.disabled = true;
    }

    UPGRADE.amountElement!.textContent = `x${UPGRADE.amount}`;

    growth_rate += UPGRADE.growth_rate * UPGRADE.amount;
  }

  if (lastTimestamp == null) lastTimestamp = timestamp;
  const DELTA_SECONDS = (timestamp - lastTimestamp) / 1000;
  xp += DELTA_SECONDS * growth_rate;
  COUNTER_ELEMENT.innerHTML = xp.toFixed(2);
  GROWTH_RATE_ELEMENT.innerHTML = `Growth rate: ${round(growth_rate, 1)} xp/s`;

  lastTimestamp = timestamp;
  requestAnimationFrame(autoClick);
}

// https://stackoverflow.com/a/7343013
function round(value: number, precision: number) {
  const MULTIPLIER = Math.pow(10, precision || 0);
  return Math.round(value * MULTIPLIER) / MULTIPLIER;
}
