import eggSprite from "./sprites/egg.png";
import "./style.css";
import upgradesJson from "./upgrades.json" with { type: "json" };

// data structure of upgradesJson
interface Item {
  name: string;
  cost: number;
  productionRate: number;
  description: string;
}

class Upgrade implements Item {
  name: string;
  cost: number;
  productionRate: number;
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
    this.productionRate = item.productionRate;
    this.description = item.description;

    this.buttonElement = button_element;
    this.amountElement = amount_element;
  }

  public buy() {
    currency -= this.cost;
    this.amount++;
    this.cost = Math.floor(this.cost * 1.15);
    this.buttonElement.textContent = `Hire ${this.name}: ${this.cost}`;
    this.amountElement.textContent = `x${this.amount}`;
  }
}

// Credit: https://stackoverflow.com/a/7343013
function round(value: number, precision: number) {
  const MULTIPLIER = Math.pow(10, precision || 0);
  return Math.round(value * MULTIPLIER) / MULTIPLIER;
}

// main currency
let currency: number = 0;
// overall growth rate
let productionRate: number = 0;

// stores all item types as objects
const UPGRADES: Upgrade[] = [];

// parse upgradesJson into an array for use in
//  creating sidebar elements
const AVAILABLE_ITEMS: Item[] = [];
for (const ITEM of upgradesJson) {
  AVAILABLE_ITEMS.push(ITEM);
}

document.body.innerHTML = `
  <div class="app">
    <main class="main">
      <div class="monster-wrapper">
        <p id="xp">XP: <span id="counter">0</span></p>
        <p id="growth-rate">per second: ${productionRate}</p>
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
  SPAN.textContent = "x0";
  DIV.appendChild(SPAN);

  // upgrade button
  const BUTTON = document.createElement("button");
  BUTTON.classList.add("upgrade-button");
  BUTTON.id = ITEM.name.toLowerCase();
  BUTTON.textContent = `Hire ${ITEM.name}: ${ITEM.cost}`;
  DIV.appendChild(BUTTON);

  // tooltip on hover
  const TOOLTIP = document.createElement("div");
  TOOLTIP.classList.add("upgrade-tooltip");
  TOOLTIP.textContent =
    `${ITEM.description} <br/><br/><strong>XP/s:</strong> ${ITEM.productionRate}`;
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
const MAIN_BUTTON = document.getElementById(
  "monster-button",
)! as HTMLButtonElement;
const COUNTER_ELEMENT = document.getElementById("counter")! as HTMLSpanElement;
const PRODUCTION_RATE_ELEMENT = document.getElementById(
  "growth-rate",
)! as HTMLSpanElement;

// main clicking logic
MAIN_BUTTON.addEventListener("click", () => {
  currency += 1;
  COUNTER_ELEMENT.textContent = String(currency);
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
  productionRate = 0;

  for (const UPGRADE of UPGRADES) {
    if (currency >= UPGRADE.cost) UPGRADE.buttonElement.disabled = false;
    else UPGRADE.buttonElement.disabled = true;

    UPGRADE.amountElement.textContent = `x${UPGRADE.amount}`;

    productionRate += UPGRADE.productionRate * UPGRADE.amount;
  }

  if (lastTimestamp == null) lastTimestamp = timestamp;
  const DELTA_SECONDS = (timestamp - lastTimestamp) / 1000;
  currency += DELTA_SECONDS * productionRate;
  COUNTER_ELEMENT.textContent = String(Math.floor(currency));
  PRODUCTION_RATE_ELEMENT.textContent = `per second: ${
    round(productionRate, 1)
  }`;

  lastTimestamp = timestamp;
  requestAnimationFrame(update);
}
