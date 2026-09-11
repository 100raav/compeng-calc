const ScientificCalc = (() => {
  let current = '0';
  let expression = '';
  let shouldReset = false;
  let history = [];
  let angleMode = 'deg';

  function getDisplay() { return BasicCalc.getDisplay(); }
  function getSecondary() { return BasicCalc.getSecondary(); }

  function formatNumber(num) {
    if (typeof num === 'string' && (num === 'Error' || num === 'Infinity' || num === 'NaN')) return 'Error';
    const n = parseFloat(num);
    if (isNaN(n)) return 'Error';
    if (Math.abs(n) > 1e15 || (Math.abs(n) < 1e-10 && n !== 0)) return n.toExponential(6);
    return parseFloat(n.toPrecision(12)).toString();
  }

  function updateDisplay() {
    getDisplay().textContent = expression || formatNumber(current);
    adjustFontSize();
  }

  function adjustFontSize() {
    const el = getDisplay();
    const len = el.textContent.length;
    if (len > 18) el.style.fontSize = '1.1rem';
    else if (len > 12) el.style.fontSize = '1.4rem';
    else if (len > 8) el.style.fontSize = '1.7rem';
    else el.style.fontSize = '';
  }

  function toRadians(deg) { return deg * Math.PI / 180; }
  function toDegrees(rad) { return rad * 180 / Math.PI; }

  function factorial(n) {
    if (n < 0) return NaN;
    if (!Number.isInteger(n)) {
      const g = gamma(n + 1);
      return g;
    }
    if (n > 170) return Infinity;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  }

  function gamma(z) {
    const g = 7;
    const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
      771.32342877765313, -176.61502916214059, 12.507343278686905,
      -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    z -= 1;
    let x = c[0];
    for (let i = 1; i < g + 2; i++) x += c[i] / (z + i);
    const t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  }

  function applyUnary(fn, x) {
    switch (fn) {
      case 'sin': return Math.sin(angleMode === 'deg' ? toRadians(x) : x);
      case 'cos': return Math.cos(angleMode === 'deg' ? toRadians(x) : x);
      case 'tan': return Math.tan(angleMode === 'deg' ? toRadians(x) : x);
      case 'asin': {
        const r = Math.asin(x);
        return angleMode === 'deg' ? toDegrees(r) : r;
      }
      case 'acos': {
        const r = Math.acos(x);
        return angleMode === 'deg' ? toDegrees(r) : r;
      }
      case 'atan': {
        const r = Math.atan(x);
        return angleMode === 'deg' ? toDegrees(r) : r;
      }
      case 'log': return Math.log10(x);
      case 'ln': return Math.log(x);
      case 'sqrt': return Math.sqrt(x);
      case 'cbrt': return Math.cbrt(x);
      case 'pow2': return x * x;
      case 'pow3': return x * x * x;
      case 'exp': return Math.exp(x);
      case 'pow10': return Math.pow(10, x);
      case 'factorial': return factorial(x);
      case 'abs': return Math.abs(x);
      case 'inv': return x === 0 ? NaN : 1 / x;
      default: return x;
    }
  }

  function tokenize(expr) {
    const tokens = [];
    let i = 0;
    const numberRe = /\d*\.?\d+(?:[eE][+-]?\d+)?/;
    while (i < expr.length) {
      const ch = expr[i];
      if (ch === ' ') { i++; continue; }
      const numMatch = expr.slice(i).match(numberRe);
      if (numMatch && numMatch.index === 0) {
        tokens.push({ type: 'num', value: parseFloat(numMatch[0]) });
        i += numMatch[0].length;
        continue;
      }
      if ('+-×÷%^'.includes(ch)) {
        if (ch === '-' && (tokens.length === 0 || tokens[tokens.length - 1].type === 'op' || tokens[tokens.length - 1].value === '(')) {
          tokens.push({ type: 'neg' });
        } else {
          tokens.push({ type: 'op', value: ch });
        }
        i++;
        continue;
      }
      if (ch === '(') { tokens.push({ type: 'lparen' }); i++; continue; }
      if (ch === ')') { tokens.push({ type: 'rparen' }); i++; continue; }
      const fnNames = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt', 'cbrt', 'abs', 'factorial'];
      const fn = fnNames.find(f => expr.startsWith(f, i));
      if (fn) {
        tokens.push({ type: 'fn', value: fn });
        i += fn.length;
        continue;
      }
      const greek = { 'π': 'pi', 'e': 'e' };
      if (greek[ch]) { tokens.push({ type: 'const', value: greek[ch] }); i++; continue; }
      i++;
    }
    return tokens;
  }

  function parse(tokens) {
    let pos = 0;
    function peek() { return tokens[pos]; }
    function next() { return tokens[pos++]; }
    function expectType(t) {
      const tok = next();
      if (!tok || tok.type !== t) throw new Error('Syntax error');
      return tok;
    }

    function parsePrimary() {
      const tok = peek();
      if (!tok) throw new Error('Unexpected end');
      if (tok.type === 'num') { next(); return tok.value; }
      if (tok.type === 'const') {
        next();
        return tok.value === 'pi' ? Math.PI : Math.E;
      }
      if (tok.type === 'neg') {
        next();
        return -parsePrimary();
      }
      if (tok.type === 'lparen') {
        next();
        const val = parseExpression();
        expectType('rparen');
        return val;
      }
      if (tok.type === 'fn') {
        next();
        let arg;
        if (peek() && peek().type === 'lparen') {
          next();
          arg = parseExpression();
          expectType('rparen');
        } else {
          arg = parsePrimary();
        }
        return applyUnary(tok.value, arg);
      }
      throw new Error('Unexpected token');
    }

    function parseFactor() {
      const value = parsePrimary();
      if (peek() && peek().type === 'op' && peek().value === '^') {
        next();
        const exp = parseUnary();
        return Math.pow(value, exp);
      }
      if (peek() && peek().type === 'fn' && peek().value === 'factorial') {
        next();
        return factorial(value);
      }
      return value;
    }

    function parseUnary() {
      if (peek() && peek().type === 'neg') {
        next();
        return -parseUnary();
      }
      return parseFactor();
    }

    function parseTerm() {
      let value = parseUnary();
      while (peek() && peek().type === 'op' && '×÷%'.includes(peek().value)) {
        const op = next().value;
        const rhs = parseUnary();
        if (op === '×') value *= rhs;
        else if (op === '÷') value = rhs === 0 ? NaN : value / rhs;
        else value = rhs === 0 ? NaN : value % rhs;
      }
      return value;
    }

    function parseExpression() {
      let value = parseTerm();
      while (peek() && peek().type === 'op' && '+-'.includes(peek().value)) {
        const op = next().value;
        const rhs = parseTerm();
        if (op === '+') value += rhs;
        else value -= rhs;
      }
      return value;
    }

    const result = parseExpression();
    if (peek()) throw new Error('Unexpected trailing tokens');
    return result;
  }

  function evaluate(expr) {
    try {
      return parse(tokenize(expr));
    } catch (err) {
      return NaN;
    }
  }

  function handleNumber(val) {
    if (shouldReset) { current = ''; expression = ''; shouldReset = false; }
    if (current === '0' && val !== '.') current = '';
    current += val;
    expression += val;
    updateDisplay();
  }

  function handleDecimal() {
    if (shouldReset) { current = '0'; expression = ''; shouldReset = false; }
    if (!current.includes('.')) {
      current += '.';
      expression += '.';
    }
    updateDisplay();
  }

  function handleOperator(op) {
    const last = expression.trim().slice(-1);
    if ('+-×÷%^'.includes(last) && op !== '−' && last !== '−') {
      expression = expression.slice(0, -1) + op + ' ';
      updateDisplay();
      return;
    }
    expression += op + ' ';
    updateDisplay();
  }

  function handleSci(fn) {
    if (fn === 'pi' || fn === 'e') {
      const symbol = fn === 'pi' ? 'π' : 'e';
      if (shouldReset) { expression = ''; shouldReset = false; }
      expression += symbol;
      current = (fn === 'pi' ? Math.PI : Math.E).toString();
      updateDisplay();
      return;
    }
    if (fn === 'paren') {
      if (expression === '' || /[×÷%^+-]\s*$/.test(expression) || shouldReset) {
        expression += '(';
        shouldReset = false;
      } else {
        const lastNonSpace = expression.trim().slice(-1);
        if (lastNonSpace >= '0' || lastNonSpace === ')') {
          expression += ')';
        } else {
          expression += '(';
        }
      }
      updateDisplay();
      return;
    }
    if (fn === 'mod') {
      handleOperator('%');
      return;
    }
    if (!shouldReset && expression !== '' && current !== '') {
      const result = applyUnary(fn, parseFloat(current));
      const wrapped = `(${expression})`;
      expression = fn + '(' + (parseFloat(current).toString()) + ')';
      current = formatNumber(result);
      shouldReset = true;
      getSecondary().textContent = `${fn}(...) =`;
      updateDisplay();
      addToHistory(wrapped + ' → ' + fn, current);
    }
  }

  function handleEquals() {
    if (!expression) return;
    const result = evaluate(expression);
    const exprText = expression;
    const resultStr = formatNumber(result);
    current = resultStr;
    expression = resultStr;
    getSecondary().textContent = `${exprText} =`;
    shouldReset = true;
    updateDisplay();
    addToHistory(exprText, resultStr);
  }

  function handleClear() {
    current = '0';
    expression = '';
    shouldReset = false;
    getSecondary().textContent = '';
    updateDisplay();
  }

  function handleBackspace() {
    if (shouldReset) return;
    if (expression.length > 0) {
      expression = expression.slice(0, -1).trim();
      const numMatch = expression.match(/[0-9.\-]*$/);
      current = numMatch ? numMatch[0] : '0';
      if (current === '' || current === '-') current = '0';
    }
    updateDisplay();
  }

  function handlePercent() {
    const result = evaluate(expression);
    const abs = Math.abs(result);
    if (abs === 0 || isNaN(abs)) return;
    const perc = result / 100;
    expression = formatNumber(perc);
    current = expression;
    shouldReset = true;
    updateDisplay();
  }

  function addToHistory(expr, result) {
    history.unshift({ expr, result, mode: 'scientific' });
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
      case 'sci': handleSci(value); break;
    }
  }

  return { handleAction, updateDisplay, evaluate };
})();