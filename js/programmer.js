const ProgrammerCalc = (() => {
  let current = '0';
  let previous = '';
  let operator = '';
  let shouldReset = false;
  let currentBase = 'dec';
  let history = [];

  const BASES = { dec: 10, hex: 16, oct: 8, bin: 2 };
  const VALID_CHARS = {
    dec: '0123456789',
    hex: '0123456789ABCDEFabcdef',
    oct: '01234567',
    bin: '01'
  };

  function toDec(val, base) { return parseInt(val, BASES[base]); }
  function fromDec(val, base) { return parseInt(val, BASES[currentBase]).toString(BASES[currentBase]).toUpperCase(); }
  function convertTo(val, fromBase, toBase) {
    const dec = parseInt(val, BASES[fromBase]);
    if (isNaN(dec)) return '0';
    return dec.toString(BASES[toBase]).toUpperCase();
  }

  function updateMultiBase() {
    const dec = toDec(current, currentBase);
    if (isNaN(dec)) return;
    document.getElementById('mb-hex').textContent = dec.toString(16).toUpperCase() || '0';
    document.getElementById('mb-dec').textContent = dec.toString(10) || '0';
    document.getElementById('mb-oct').textContent = dec.toString(8).toUpperCase() || '0';
    document.getElementById('mb-bin').textContent = dec.toString(2) || '0';
  }

  function updateBitDisplay() {
    const container = document.getElementById('bit-display');
    const dec = toDec(current, currentBase);
    if (isNaN(dec) || dec < 0) { container.innerHTML = '<span style="color:var(--text-secondary)">Enter a value</span>'; return; }
    let bits = dec.toString(2);
    while (bits.length < 8) bits = '0' + bits;
    while (bits.length % 8 !== 0) bits = '0' + bits;
    let html = '';
    for (let i = 0; i < bits.length; i++) {
      if (i > 0 && i % 8 === 0) html += '<span class="bit-sep">|</span>';
      if (i > 0 && i % 4 === 0) html += ' ';
      html += `<span class="bit bit-${bits[i]}">${bits[i]}</span>`;
    }
    container.innerHTML = html;
  }

  function updateDisplay() {
    BasicCalc.getDisplay().textContent = formatForBase(current);
    updateMultiBase();
    updateBitDisplay();
    adjustFontSize();
  }

  function formatForBase(val) { return val || '0'; }

  function adjustFontSize() {
    const el = BasicCalc.getDisplay();
    const len = el.textContent.length;
    if (len > 20) el.style.fontSize = '1rem';
    else if (len > 14) el.style.fontSize = '1.3rem';
    else if (len > 8) el.style.fontSize = '1.6rem';
    else el.style.fontSize = '';
  }

  function isValidChar(val) {
    return VALID_CHARS[currentBase].includes(val);
  }

  function canAddDigit(val) {
    return isValidChar(val);
  }

  function handleNumber(val) {
    if (shouldReset) { current = ''; shouldReset = false; }
    if (!canAddDigit(val)) return;
    if (current === '0') current = '';
    current += val.toUpperCase();
    updateDisplay();
  }

  function handleOperator(op) {
    if (operator && !shouldReset) {
      handleEquals();
    }
    previous = current;
    operator = op;
    shouldReset = true;
    BasicCalc.getSecondary().textContent = `${formatForBase(previous)} ${op}`;
  }

  function handleBitwise(op) {
    if (operator && !shouldReset) { handleEquals(); }
    if (op === 'NOT') {
      const dec = toDec(current, currentBase);
      const result = (~dec) >>> 0;
      const resultStr = result.toString(BASES[currentBase]).toUpperCase();
      const expr = `NOT ${formatForBase(current)}`;
      BasicCalc.getSecondary().textContent = expr;
      current = resultStr;
      shouldReset = true;
      updateDisplay();
      addToHistory(expr, resultStr);
      return;
    }
    previous = current;
    operator = op;
    shouldReset = true;
    BasicCalc.getSecondary().textContent = `${formatForBase(previous)} ${op}`;
  }

  function handleShift(type) {
    const dec = toDec(current, currentBase);
    let result;
    let expr;
    if (type === 'LSHIFT') {
      result = (dec << 1) >>> 0;
      expr = `${formatForBase(current)} << 1`;
    } else {
      result = dec >>> 1;
      expr = `${formatForBase(current)} >> 1`;
    }
    const resultStr = result.toString(BASES[currentBase]).toUpperCase();
    BasicCalc.getSecondary().textContent = expr;
    current = resultStr;
    shouldReset = true;
    updateDisplay();
    addToHistory(expr, resultStr);
  }

  function handleTwosComplement(type) {
    const dec = toDec(current, currentBase);
    let result;
    let expr;
    if (type === 'twos') {
      result = ((~dec) + 1) >>> 0;
      expr = `2's complement of ${formatForBase(current)}`;
    } else {
      result = (~dec) >>> 0;
      expr = `1's complement of ${formatForBase(current)}`;
    }
    const resultStr = result.toString(BASES[currentBase]).toUpperCase();
    BasicCalc.getSecondary().textContent = expr;
    current = resultStr;
    shouldReset = true;
    updateDisplay();
    addToHistory(expr, resultStr);
  }

  function calculate(a, op, b) {
    const x = toDec(a, currentBase);
    const y = toDec(b, currentBase);
    let result;
    switch (op) {
      case '+': result = x + y; break;
      case '−': result = x - y; break;
      case '×': result = x * y; break;
      case '÷': result = y === 0 ? 'Error' : Math.trunc(x / y); break;
      case 'AND': result = x & y; break;
      case 'OR': result = x | y; break;
      case 'XOR': result = x ^ y; break;
      case 'NAND': result = ~(x & y) >>> 0; break;
      case 'NOR': result = ~(x | y) >>> 0; break;
      case 'XNOR': result = ~(x ^ y) >>> 0; break;
      default: result = y;
    }
    return result;
  }

  function handleEquals() {
    if (!operator) return;
    const result = calculate(previous, operator, current);
    const expr = `${formatForBase(previous)} ${operator} ${formatForBase(current)}`;
    const resultStr = result.toString(BASES[currentBase]).toUpperCase();
    current = resultStr;
    BasicCalc.getSecondary().textContent = `${expr} =`;
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
    BasicCalc.getSecondary().textContent = '';
    updateDisplay();
  }

  function handleBackspace() {
    if (shouldReset) return;
    current = current.slice(0, -1) || '0';
    updateDisplay();
  }

  function setBase(base) {
    currentBase = base;
    document.querySelectorAll('.base-btn').forEach(b => b.classList.toggle('active', b.dataset.base === base));
    updateDisabledButtons();
    current = '0';
    previous = '';
    operator = '';
    shouldReset = false;
    BasicCalc.getSecondary().textContent = '';
    updateDisplay();
  }

  function updateDisabledButtons() {
    const hexBtns = document.querySelectorAll('.hex-a');
    const allNumBtns = document.querySelectorAll('#panel-programmer .calc-btn.num');
    allNumBtns.forEach(btn => {
      const val = btn.dataset.value;
      if ('ABCDEF'.includes(val)) {
        if (currentBase === 'hex') {
          btn.classList.remove('disabled');
        } else {
          btn.classList.add('disabled');
        }
      }
      if (currentBase === 'bin' && '23456789'.includes(val)) {
        btn.classList.add('disabled');
      } else if (currentBase === 'oct' && '89'.includes(val)) {
        btn.classList.add('disabled');
      } else if (!'ABCDEF'.includes(val)) {
        btn.classList.remove('disabled');
      }
    });
  }

  function addToHistory(expr, result) {
    history.unshift({ expr, result, mode: 'programmer' });
    if (history.length > 20) history.pop();
    if (window.App) window.App.updateHistory(history);
  }

  function handleAction(action, value) {
    switch (action) {
      case 'number': handleNumber(value); break;
      case 'operator': handleOperator(value); break;
      case 'equals': handleEquals(); break;
      case 'clear': handleClear(); break;
      case 'backspace': handleBackspace(); break;
      case 'bitwise': handleBitwise(value); break;
      case 'shift': handleShift(value); break;
      case 'twos-complement': handleTwosComplement(value); break;
    }
  }

  return { handleAction, setBase, updateDisplay, updateDisabledButtons };
})();
