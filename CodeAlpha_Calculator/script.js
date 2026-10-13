const current = document.getElementById("current");
const previous = document.getElementById("previous");
let expression = "";
let justEvaluated = false;

function render() {
  current.textContent = expression || "0";
}
function add(value) {
  if (justEvaluated && /[0-9.]/.test(value)) expression = "";
  justEvaluated = false;
  if (value === "." && expression.split(/[+\-*/]/).pop().includes(".")) return;
  expression += value;
  render();
}
function calculate() {
  if (!expression) return;
  try {
    if (/[^0-9+\-*/%.() ]/.test(expression)) throw new Error();
    const result = Function('"use strict"; return (' + expression + ')')();
    if (!Number.isFinite(result)) throw new Error();
    previous.textContent = expression + " =";
    expression = String(Number(result.toFixed(10)));
    justEvaluated = true;
    render();
  } catch {
    current.textContent = "Error";
    expression = "";
  }
}
document.querySelectorAll("[data-number]").forEach(b => b.onclick = () => add(b.dataset.number));
document.querySelectorAll("[data-op]").forEach(b => b.onclick = () => {
  if (!expression) return;
  if (/[+\-*/]$/.test(expression)) expression = expression.slice(0, -1);
  add(b.dataset.op);
});
document.querySelector('[data-action="equals"]').onclick = calculate;
document.querySelector('[data-action="clear"]').onclick = () => { expression = ""; previous.textContent = ""; render(); };
document.querySelector('[data-action="delete"]').onclick = () => { expression = expression.slice(0, -1); render(); };
document.querySelector('[data-action="percent"]').onclick = () => {
  if (expression) { expression = String(Number(expression) / 100); render(); }
};
document.addEventListener("keydown", e => {
  if (/^[0-9.]$/.test(e.key)) add(e.key);
  else if ("+-*/".includes(e.key)) add(e.key);
  else if (e.key === "Enter" || e.key === "=") calculate();
  else if (e.key === "Backspace") { expression = expression.slice(0, -1); render(); }
  else if (e.key === "Escape") { expression = ""; previous.textContent = ""; render(); }
  else if (e.key === "%") document.querySelector('[data-action="percent"]').click();
});
