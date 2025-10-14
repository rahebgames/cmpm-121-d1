import eggSprite from "./sprites/egg.png";
import "./style.css";
import upgradesJson from "./upgrades.json" with { type: "json" };

// main currency
let xp: number = 0;
let growth_rate: number = 0;
const UPGRADES: Upgrade[] = [];

interface Item {
  name: string;
  cost: number;
  growth_rate: number;
  description: string;
}

const AVAILABLE_ITEMS: Item[] = [];
for (const ITEM of upgradesJson) {
  AVAILABLE_ITEMS.push(ITEM);
}

class Upgrade implements Item {
  name: string;
  cost: number;
  growth_rate: number;
  description: string;
  amount: number = 0;
  buttonElement: HTMLButtonElement;
  amountElement: HTMLSpanElement;

  constructor(
    item: Item,
    button_element: HTMLButtonElement,
    amount_element: HTMLSpanElement,
  ) {
    this.name = item.name;
    this.cost = item.cost;
    this.growth_rate = item.growth_rate;
    this.description = item.description;

    this.buttonElement = button_element;
    this.amountElement = amount_element;
  }

  public buy() {
    xp -= this.cost;
    this.amount++;
    this.cost = Math.floor(this.cost * 1.15);
    this.buttonElement.innerHTML = `Hire ${this.name}: ${this.cost}`;
    this.amountElement.textContent = `x${this.amount}`;
  }
}

document.body.innerHTML = `
  <div class="app">
    <main class="monster-flexbox content">
      <div class="monster-wrapper">
        <p id="xp">XP: <span id="counter">0</span></p>
        <p id="growth-rate">per second: ${growth_rate}</p>
        <button id="monster-button" type="button"><img src="${eggSprite}" class="icon" /></button>
      </div>
    </main>

    <aside class="sidebar"></aside>
  </div>
`;

const SIDEBAR = document.querySelector(".sidebar") as HTMLElement;

for (const ITEM of AVAILABLE_ITEMS) {
  const DIV = document.createElement("div");
  DIV.classList.add("upgrade-wrapper");

  const SPAN = document.createElement("span");
  SPAN.classList.add("upgrade-amount");
  SPAN.id = `${ITEM.name.toLowerCase()}-amount`;
  SPAN.innerHTML = "x0";
  DIV.appendChild(SPAN);

  const BUTTON = document.createElement("button");
  BUTTON.classList.add("upgrade");
  BUTTON.id = ITEM.name.toLowerCase();
  BUTTON.innerHTML = `Hire ${ITEM.name}: ${ITEM.cost}`;
  DIV.appendChild(BUTTON);

  const TOOLTIP = document.createElement("div");
  TOOLTIP.classList.add("upgrade-tooltip");
  TOOLTIP.innerHTML =
    `${ITEM.description} <br/><br/><strong>XP/s:</strong> ${ITEM.growth_rate}`;
  DIV.appendChild(TOOLTIP);

  DIV.addEventListener("mouseenter", () => {
    const tooltipRect = TOOLTIP.getBoundingClientRect();
    const margin = 8;
    if (tooltipRect.top < margin) {
      const shift = margin - tooltipRect.top;
      const currentTop = parseFloat(getComputedStyle(TOOLTIP).top || "0");
      const newTop = currentTop + shift;
      TOOLTIP.style.top = `${newTop}px`;
    }
  });

  DIV.addEventListener("mouseleave", () => {
    TOOLTIP.style.top = "";
  });

  SIDEBAR.appendChild(DIV);

  UPGRADES.push(new Upgrade(ITEM, BUTTON, SPAN));
}

const MONSTER = document.getElementById("monster-button")! as HTMLButtonElement;
const COUNTER_ELEMENT = document.getElementById("counter")! as HTMLSpanElement;
const GROWTH_RATE_ELEMENT = document.getElementById(
  "growth-rate",
)! as HTMLSpanElement;

requestAnimationFrame(autoClick);

MONSTER.addEventListener("click", () => {
  xp += 1;
  COUNTER_ELEMENT.innerHTML = String(xp);
});

for (const UPGRADE of UPGRADES) {
  UPGRADE.buttonElement.addEventListener("click", () => {
    UPGRADE.buy();
  });
}

let lastTimestamp: number | null = null;
function autoClick(timestamp: DOMHighResTimeStamp) {
  growth_rate = 0;
  for (const UPGRADE of UPGRADES) {
    if (xp >= UPGRADE.cost) {
      UPGRADE.buttonElement.disabled = false;
    } else {
      UPGRADE.buttonElement.disabled = true;
    }

    UPGRADE.amountElement.textContent = `x${UPGRADE.amount}`;

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
