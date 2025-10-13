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
    this.cost = Math.floor(this.cost * 1.15);
    this.buttonElement!.innerHTML = `Hire ${this.name}: ${this.cost}`;
    this.amountElement!.textContent = `x${this.amount}`;
  }
}

UPGRADES.push(new Upgrade("Boxer", 10, 0.1));
UPGRADES.push(new Upgrade("Swordsman", 100, 2.0));
UPGRADES.push(new Upgrade("Archer", 1000, 50));

document.body.innerHTML = `
  <div class="app">
    <main class="monster-flexbox content">
      <div class="monster-wrapper">
        <p id="xp">XP: <span id="counter">0</span></p>
        <p id="growth-rate">per second: ${growth_rate}</p>
        <button id="monster-button" type="button"><img src="${eggSprite}" class="icon" /></button>
      </div>
    </main>

    <aside class="sidebar">
      <div class="upgrade-wrapper">
        <span class="upgrade-amount" id="boxer-amount">x0</span>
        <button class="upgrade" id="boxer">Hire Boxer: ${
  UPGRADES[0].cost
}</button>
      </div>
      <div class="upgrade-wrapper">
        <span class="upgrade-amount" id="swordsman-amount">x0</span>
        <button class="upgrade" id="swordsman">Hire Swordsman: ${
  UPGRADES[1].cost
}</button>
      </div>
      <div class="upgrade-wrapper">
        <span class="upgrade-amount" id="archer-amount">x0</span>
        <button class="upgrade" id="archer">Hire Archer: ${
  UPGRADES[2].cost
}</button>
      </div>
    </aside>
  </div>
`;

const MONSTER = document.getElementById("monster-button")! as HTMLButtonElement;
const COUNTER_ELEMENT = document.getElementById("counter")! as HTMLSpanElement;
const GROWTH_RATE_ELEMENT = document.getElementById(
  "growth-rate",
)! as HTMLSpanElement;

UPGRADES[0].buttonElement = document.getElementById(
  "boxer",
)! as HTMLButtonElement;
UPGRADES[1].buttonElement = document.getElementById(
  "swordsman",
)! as HTMLButtonElement;
UPGRADES[2].buttonElement = document.getElementById(
  "archer",
)! as HTMLButtonElement;

UPGRADES[0].amountElement = document.getElementById(
  "boxer-amount",
)! as HTMLSpanElement;
UPGRADES[1].amountElement = document.getElementById(
  "swordsman-amount",
)! as HTMLSpanElement;
UPGRADES[2].amountElement = document.getElementById(
  "archer-amount",
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
  COUNTER_ELEMENT.innerHTML = String(Math.floor(xp));
  GROWTH_RATE_ELEMENT.innerHTML = `per second: ${round(growth_rate, 1)}`;

  lastTimestamp = timestamp;
  requestAnimationFrame(autoClick);
}

// https://stackoverflow.com/a/7343013
function round(value: number, precision: number) {
  const MULTIPLIER = Math.pow(10, precision || 0);
  return Math.round(value * MULTIPLIER) / MULTIPLIER;
}
