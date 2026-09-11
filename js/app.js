const App = (() => {
  let currentMode = 'basic';
  let allHistory = [];

  function switchMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
    document.querySelectorAll('.mode-panel').forEach(p => p.classList.toggle('active', p.id === `panel-${mode}`));
    const multiBase = document.getElementById('multi-base-bar');
    multiBase.style.display = mode === 'programmer' ? 'grid' : 'none';
    if (mode === 'programmer') ProgrammerCalc.updateDisabledButtons();
  }

  function updateHistory(history) {
    const mode = history[0] ? history[0].mode : null;
    if (mode) allHistory = allHistory.filter(h => h.mode !== mode);
    allHistory = history.concat(allHistory.filter(h => h.mode !== mode)).slice(0, 50);
    renderHistory();
  }

  function renderHistory() {
    const list = document.getElementById('history-list');
    if (allHistory.length === 0) {
      list.innerHTML = '<p class="history-empty">No calculations yet</p>';
      return;
    }
    list.innerHTML = allHistory.slice(0, 30).map(h => `
      <div class="history-item">
        <div class="h-expr">${h.expr}</div>
        <div class="h-result">= ${h.result}</div>
      </div>
    `).join('');
  }

  function handleCalcButton(e) {
    const btn = e.target.closest('.calc-btn');
    if (!btn || btn.classList.contains('disabled')) return;
    const action = btn.dataset.action;
    const value = btn.dataset.value;
    if (!action) return;
    btn.classList.add('pressed');
    setTimeout(() => btn.classList.remove('pressed'), 120);
    switch (currentMode) {
      case 'basic': BasicCalc.handleAction(action, value); break;
      case 'programmer': ProgrammerCalc.handleAction(action, value); break;
      case 'scientific': ScientificCalc.handleAction(action, value); break;
    }
  }

  function handleKeyboard(e) {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') return;
    const key = e.key;
    if (key >= '0' && key <= '9') {
      document.querySelector(`#panel-${currentMode} .calc-btn.num[data-value="${key}"]`)?.click();
    } else if (key === '.') {
      document.querySelector(`#panel-${currentMode} .calc-btn[data-action="decimal"]`)?.click();
    } else if (key === '+') {
      document.querySelector(`#panel-${currentMode} .calc-btn.op[data-value="+"]`)?.click();
    } else if (key === '-') {
      document.querySelector(`#panel-${currentMode} .calc-btn.op[data-value="−"]`)?.click();
    } else if (key === '*') {
      document.querySelector(`#panel-${currentMode} .calc-btn.op[data-value="×"]`)?.click();
    } else if (key === '/') {
      e.preventDefault();
      document.querySelector(`#panel-${currentMode} .calc-btn.op[data-value="÷"]`)?.click();
    } else if (key === 'Enter' || key === '=') {
      document.querySelector(`#panel-${currentMode} .calc-btn.eq`)?.click();
    } else if (key === 'Backspace') {
      document.querySelector(`#panel-${currentMode} .calc-btn[data-action="backspace"]`)?.click();
    } else if (key === 'Escape' || key === 'Delete') {
      document.querySelector(`#panel-${currentMode} .calc-btn[data-action="clear"]`)?.click();
    } else if (key === '%') {
      document.querySelector(`#panel-${currentMode} .calc-btn[data-action="percent"]`)?.click();
    }
  }

  function toggleHistory() {
    document.getElementById('history-panel').classList.toggle('open');
  }

  function init() {
    document.querySelectorAll('.mode-tab').forEach(tab => {
      tab.addEventListener('click', () => switchMode(tab.dataset.mode));
    });
    document.querySelectorAll('.base-btn').forEach(btn => {
      btn.addEventListener('click', () => ProgrammerCalc.setBase(btn.dataset.base));
    });
    document.querySelectorAll('.calc-body').forEach(body => {
      body.addEventListener('click', handleCalcButton);
    });
    document.addEventListener('keydown', handleKeyboard);
    document.getElementById('history-toggle').addEventListener('click', toggleHistory);
    document.getElementById('history-close').addEventListener('click', () => {
      document.getElementById('history-panel').classList.remove('open');
    });
    document.getElementById('history-clear').addEventListener('click', () => {
      allHistory = [];
      renderHistory();
    });
    NetworkCalc.init();
    ConverterCalc.init();
    switchMode('basic');
  }

  document.addEventListener('DOMContentLoaded', init);

  return { switchMode, updateHistory, currentMode: () => currentMode };
})();
