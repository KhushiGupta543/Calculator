document.addEventListener("DOMContentLoaded", () => {
  const exprEl = document.getElementById("expression");
  const resEl = document.getElementById("result");
  const historyList = document.getElementById("historyList");
  const themeToggle = document.getElementById("themeToggle");
  let expr = "";
  let memory = 0;

  function updateDisplay() {
    exprEl.textContent = expr || "0";
    try {
      if (!expr) {
        resEl.textContent = "0";
        return;
      }
      const safeExpr = expr.replace(/÷/g, "/").replace(/×/g, "*").replace(/−/g, "-");
      if (/[a-zA-Z]/.test(safeExpr)) throw new Error();
      const val = Function("return (" + safeExpr + ")")();
      if (typeof val === "number" && !isNaN(val)) {
        resEl.textContent = val.toString();
      } else {
        resEl.textContent = "";
      }
    } catch {
      resEl.textContent = "";
    }
  }

  function calculate() {
    try {
      const safeExpr = expr.replace(/÷/g, "/").replace(/×/g, "*").replace(/−/g, "-");
      if (!safeExpr) return;
      const val = Function("return (" + safeExpr + ")")();
      if (!isNaN(val)) {
        historyList.innerHTML = `<li>${expr} = ${val}</li>` + historyList.innerHTML;
        expr = val.toString();
        updateDisplay();
      }
    } catch {
      resEl.textContent = "Error";
      setTimeout(() => (resEl.textContent = ""), 800);
    }
  }

  function handleMemory(action) {
    const current = parseFloat(resEl.textContent) || 0;
    switch (action) {
      case "MC": memory = 0; break;
      case "MR": expr += memory; break;
      case "M+": memory += current; break;
      case "M-": memory -= current; break;
    }
    updateDisplay();
  }

  document.querySelectorAll(".key").forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.value;
      const action = btn.dataset.action;
      if (value) {
        expr += value;
      } else if (action) {
        if (action === "AC") expr = "";
        else if (action === "back") expr = expr.slice(0, -1);
        else if (["MC", "MR", "M+", "M-"].includes(action)) return handleMemory(action);
        else if (action === "=") return calculate();
      }
      updateDisplay();
    });
  });

  window.addEventListener("keydown", (e) => {
    if (/^[0-9+\-*/().]$/.test(e.key)) {
      expr += e.key;
    } else if (e.key === "Enter") {
      calculate();
    } else if (e.key === "Backspace") {
      expr = expr.slice(0, -1);
    } else if (e.key === "Escape") {
      expr = "";
    }
    updateDisplay();
  });

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  });

  updateDisplay();
});
