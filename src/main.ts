import exampleIconUrl from "./sprites/egg.png";
import "./style.css";

// <p>Example image asset: <img src="${exampleIconUrl}" class="icon" /></p>
document.body.innerHTML = `
  <button class="monster" type="button"><img src="${exampleIconUrl}" class="icon" /></button>
`;
