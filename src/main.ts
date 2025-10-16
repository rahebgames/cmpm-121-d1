import eggSprite from "./sprites/egg.png";
import "./style.css";
import upgradesJson from "./upgrades.json" with { type: "json" };

// main currency
let xp: number = 0;
// overall growth rate
let growth_rate: number = 0;

// stores all item types as objects
const UPGRADES: Upgrade[] = [];

// data structure of upgradesJson
interface Item {
  name: string;
  cost: number;
  growth_rate: number;
  description: string;
}

// parse upgradesJson into an array for use in
//  creating sidebar elements
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
    <main class="main">
      <div class="monster-wrapper">
        <p id="xp">XP: <span id="counter">0</span></p>
        <p id="growth-rate">per second: ${growth_rate}</p>
        <button id="monster-button" type="button"><img src="${eggSprite}" class="icon" /></button>
      </div>
    </main>

    <aside class="sidebar"></aside>
  </div>
`;

// create sidebar and populate with items based on
//  data in upgradesJson
const SIDEBAR = document.querySelector(".sidebar") as HTMLElement;
for (const ITEM of AVAILABLE_ITEMS) {
  // main div for upgrades
  const DIV = document.createElement("div");
  DIV.classList.add("upgrade-wrapper");

  // shows amount of upgrades owned
  const SPAN = document.createElement("span");
  SPAN.classList.add("upgrade-amount");
  SPAN.id = `${ITEM.name.toLowerCase()}-amount`;
  SPAN.innerHTML = "x0";
  DIV.appendChild(SPAN);

  // upgrade button
  const BUTTON = document.createElement("button");
  BUTTON.classList.add("upgrade-button");
  BUTTON.id = ITEM.name.toLowerCase();
  BUTTON.innerHTML = `Hire ${ITEM.name}: ${ITEM.cost}`;
  DIV.appendChild(BUTTON);

  // tooltip on hover
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
      TOOLTIP.style.top = `${shift}px`;
    }
  });

  DIV.addEventListener("mouseleave", () => {
    TOOLTIP.style.top = "";
  });

  SIDEBAR.appendChild(DIV);

  UPGRADES.push(new Upgrade(ITEM, BUTTON, SPAN));
}

// get important static elements from HTML
const MONSTER = document.getElementById("monster-button")! as HTMLButtonElement;
const COUNTER_ELEMENT = document.getElementById("counter")! as HTMLSpanElement;
const GROWTH_RATE_ELEMENT = document.getElementById(
  "growth-rate",
)! as HTMLSpanElement;

// main clicking logic
MONSTER.addEventListener("click", () => {
  xp += 1;
  COUNTER_ELEMENT.innerHTML = String(xp);
});

// attach click logic to every upgrade button, which
//  calls buy method
for (const UPGRADE of UPGRADES) {
  UPGRADE.buttonElement.addEventListener("click", () => {
    UPGRADE.buy();
  });
}

// start main loop
requestAnimationFrame(update);

// main update loop, used for xp gain over time
let lastTimestamp: number | null = null;
function update(timestamp: DOMHighResTimeStamp) {
  growth_rate = 0;

  for (const UPGRADE of UPGRADES) {
    if (xp >= UPGRADE.cost) UPGRADE.buttonElement.disabled = false;
    else UPGRADE.buttonElement.disabled = true;

    UPGRADE.amountElement.textContent = `x${UPGRADE.amount}`;

    growth_rate += UPGRADE.growth_rate * UPGRADE.amount;
  }

  if (lastTimestamp == null) lastTimestamp = timestamp;
  const DELTA_SECONDS = (timestamp - lastTimestamp) / 1000;
  xp += DELTA_SECONDS * growth_rate;
  COUNTER_ELEMENT.innerHTML = String(Math.floor(xp));
  GROWTH_RATE_ELEMENT.innerHTML = `per second: ${round(growth_rate, 1)}`;

  lastTimestamp = timestamp;
  requestAnimationFrame(update);
}

// Credit: https://stackoverflow.com/a/7343013
function round(value: number, precision: number) {
  const MULTIPLIER = Math.pow(10, precision || 0);
  return Math.round(value * MULTIPLIER) / MULTIPLIER;
}
