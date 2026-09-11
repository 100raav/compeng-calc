const BasicCalc = (() => {
  let current = '0';
  let previous = '';
  let operator = '';
  let shouldReset = false;
  let history = [];

  function getDisplay() { return document.getElementById('display-main'); }
  function getSecondary() { return document.getElementById('display-secondary'); }

  function formatNumber(num) {
    if (num === 'Error' || num === 'Infinity' || num === '-Infinity') return 'Error';
    if (typeof num === 'string' && num.includes('.') && num.endsWith('.')) return num;
    const n = parseFloat(num);
    if (isNaN(n)) return '0';
    if (Math.abs(n) > 1e15 || (Math.abs(n) < 1e-10 && n !== 0)) return n.toExponential(6);
    return parseFloat(n.toPrecision(12)).toString();
  }

  function updateDisplay() {
    getDisplay().textContent = formatNumber(current);
    adjustFontSize();
  }

  function adjustFontSize() {
    const el = getDisplay();
    const len = el.textContent.length;
    if (len > 16) el.style.fontSize = '1.2rem';
    else if (len > 12) el.style.fontSize = '1.5rem';
    else if (len > 8) el.style.fontSize = '1.8rem';
    else el.style.fontSize = '';
  }

  function calculate(a, op, b) {
    const x = parseFloat(a);
    const y = parseFloat(b);
    switch (op) {
      case '+': return x + y;
      case '−': return x - y;
      case '×': return x * y;
      case '÷': return y === 0 ? 'Error' : x / y;
      case 'mod': return y === 0 ? 'Error' : x % y;
      default: return y;
    }
  }

  function handleNumber(val) {
    if (shouldReset) { current = ''; shouldReset = false; }
    if (current === '0' && val !== '.') current = '';
    current += val;
    updateDisplay();
  }

  function handleDecimal() {
    if (shouldReset) { current = '0'; shouldReset = false; }
    if (!current.includes('.')) current += '.';
    updateDisplay();
  }

  function handleOperator(op) {
    if (operator && !shouldReset) {
      const result = calculate(previous, operator, current);
      previous = result.toString();
      current = formatNumber(result);
      updateDisplay();
    } else {
      previous = current;
    }
    operator = op;
    shouldReset = true;
    getSecondary().textContent = `${formatNumber(previous)} ${op}`;
  }

  function handleEquals() {
    if (!operator) return;
    const result = calculate(previous, operator, current);
    const expr = `${formatNumber(previous)} ${operator} ${formatNumber(current)}`;
    const resultStr = formatNumber(result);
    current = resultStr;
    getSecondary().textContent = `${expr} =`;
    previous = '';
    operator = '';
    shouldReset = true;
    updateDisplay();
    addToHistory(expr, resultStr);
  }

  function handleClear() {
    current = '0';
    previous = '';
    operator = '';
    shouldReset = false;
    getSecondary().textContent = '';
    updateDisplay();
  }

  function handleBackspace() {
    if (shouldReset) return;
    current = current.slice(0, -1) || '0';
    updateDisplay();
  }

  function handlePercent() {
    const n = parseFloat(current);
    if (isNaN(n)) return;
    if (previous && operator) {
      current = (parseFloat(previous) * n / 100).toString();
    } else {
      current = (n / 100).toString();
    }
    updateDisplay();
  }

  function handleNegate() {
    if (current === '0') return;
    current = current.startsWith('-') ? current.slice(1) : '-' + current;
    updateDisplay();
  }

  function addToHistory(expr, result) {
    history.unshift({ expr, result, mode: 'basic' });
    if (history.length > 20) history.pop();
    if (window.App) window.App.updateHistory(history);
  }

  function handleAction(action, value) {
    switch (action) {
      case 'number': handleNumber(value); break;
      case 'decimal': handleDecimal(); break;
      case 'operator': handleOperator(value); break;
      case 'equals': handleEquals(); break;
      case 'clear': handleClear(); break;
      case 'backspace': handleBackspace(); break;
      case 'percent': handlePercent(); break;
      case 'negate': handleNegate(); break;
    }
  }

  function getState() { return { current, previous, operator }; }

  return { handleAction, getState, formatNumber, updateDisplay, getDisplay, getSecondary };
})();
