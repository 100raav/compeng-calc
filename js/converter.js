const ConverterCalc = (() => {

  function convertAscii() {
    const input = document.getElementById('ascii-input').value.trim();
    if (!input) return;
    const isHex = /^[0-9A-Fa-f ]+$/.test(input) && !/^[a-zA-Z]/.test(input);
    let chars;
    if (isHex) {
      const hexParts = input.replace(/\s+/g, ' ').split(' ').filter(Boolean);
      chars = hexParts.map(h => parseInt(h, 16)).filter(n => !isNaN(n));
    } else {
      chars = Array.from(input).map(c => c.charCodeAt(0));
    }
    if (chars.length === 0) return;
    document.getElementById('res-ascii-dec').textContent = chars.map(c => c.toString(10)).join(' ');
    document.getElementById('res-ascii-hex').textContent = chars.map(c => c.toString(16).toUpperCase().padStart(2, '0')).join(' ');
    document.getElementById('res-ascii-bin').textContent = chars.map(c => c.toString(2).padStart(8, '0')).join(' ');
    document.getElementById('res-ascii-oct').textContent = chars.map(c => c.toString(8).padStart(3, '0')).join(' ');
    renderAsciiTable(chars);
  }

  function renderAsciiTable(highlight) {
    const container = document.getElementById('ascii-table');
    let html = '<table><thead><tr><th>Dec</th><th>Hex</th><th>Bin</th><th>Char</th></tr></thead><tbody>';
    for (let i = 32; i < 127; i++) {
      const hl = highlight && highlight.includes(i) ? ' class="highlight"' : '';
      const ch = i === 32 ? '(space)' : String.fromCharCode(i);
      html += `<tr${hl}><td>${i}</td><td>${i.toString(16).toUpperCase().padStart(2, '0')}</td><td>${i.toString(2).padStart(8, '0')}</td><td>${ch}</td></tr>`;
    }
    html += '</tbody></table>';
    container.innerHTML = html;
  }

  function convertIEEE754() {
    const input = document.getElementById('ieee-input').value.trim();
    const val = parseFloat(input);
    if (isNaN(val)) return;
    const buffer = new ArrayBuffer(4);
    new Float32Array(buffer)[0] = val;
    const int32 = new Uint32Array(buffer)[0];
    const sign = (int32 >>> 31) & 1;
    const exponent = (int32 >>> 23) & 0xFF;
    const mantissa = int32 & 0x7FFFFF;

    document.getElementById('res-iee-sign').textContent = `${sign} (${sign === 0 ? '+' : '-'})`;
    document.getElementById('res-iee-exp').textContent = `${exponent.toString(2).padStart(8, '0')} (${exponent})`;
    document.getElementById('res-iee-man').textContent = `${mantissa.toString(2).padStart(23, '0')}`;
    document.getElementById('res-iee-hex').textContent = '0x' + int32.toString(16).toUpperCase().padStart(8, '0');

    const visual = document.getElementById('ieee-visual');
    const signBin = sign.toString(2);
    const expBin = exponent.toString(2).padStart(8, '0');
    const manBin = mantissa.toString(2).padStart(23, '0');
    visual.innerHTML = `
      <div style="margin-bottom:8px;color:var(--text-secondary);font-size:0.75rem">IEEE 754 Single-Precision (32-bit)</div>
      <div><span class="bit-label">Sign (1 bit)</span><span class="sign-bit">${signBin}</span></div>
      <div><span class="bit-label">Exponent (8 bits)</span><span class="exp-bits">${expBin}</span></div>
      <div><span class="bit-label">Mantissa (23 bits)</span><span class="man-bits">${manBin}</span></div>
      <div style="margin-top:8px;font-size:0.75rem;color:var(--text-secondary)">
        Formula: (-1)<sup>sign</sup> × 2<sup>exponent-127</sup> × 1.mantissa
      </div>
    `;
  }

  function convertStorage() {
    const val = parseFloat(document.getElementById('storage-input').value);
    const unit = document.getElementById('storage-unit').value;
    if (isNaN(val)) return;
    const multipliers = { bits: 1, bytes: 8, KB: 8 * 1024, MB: 8 * 1024 * 1024, GB: 8 * 1024 * 1024 * 1024, TB: 8 * 1024 * 1024 * 1024 * 1024, PB: 8 * 1024 * 1024 * 1024 * 1024 * 1024 };
    const bits = val * multipliers[unit];
    const fmt = (n) => {
      if (n === 0) return '0';
      if (n < 0.0001) return n.toExponential(4);
      return parseFloat(n.toPrecision(10)).toString();
    };
    document.getElementById('res-st-bits').textContent = fmt(bits);
    document.getElementById('res-st-bytes').textContent = fmt(bits / 8);
    document.getElementById('res-st-kb').textContent = fmt(bits / (8 * 1024));
    document.getElementById('res-st-mb').textContent = fmt(bits / (8 * 1024 * 1024));
    document.getElementById('res-st-gb').textContent = fmt(bits / (8 * 1024 * 1024 * 1024));
    document.getElementById('res-st-tb').textContent = fmt(bits / (8 * 1024 * 1024 * 1024 * 1024));
    document.getElementById('res-st-pb').textContent = fmt(bits / (8 * Math.pow(1024, 5)));
  }

  function convertDataRate() {
    const val = parseFloat(document.getElementById('rate-input').value);
    const unit = document.getElementById('rate-unit').value;
    if (isNaN(val)) return;
    const toBps = { bps: 1, Kbps: 1000, Mbps: 1e6, Gbps: 1e9, Tbps: 1e12, Bps: 8, KBps: 8000, MBps: 8e6, GBps: 8e9 };
    const bps = val * toBps[unit];
    const fmt = (n) => {
      if (n === 0) return '0';
      if (n < 0.001) return n.toExponential(4);
      return parseFloat(n.toPrecision(10)).toLocaleString('en-US', { maximumFractionDigits: 4 });
    };
    document.getElementById('res-rate-bps').textContent = fmt(bps);
    document.getElementById('res-rate-kbps').textContent = fmt(bps / 1000);
    document.getElementById('res-rate-mbps').textContent = fmt(bps / 1e6);
    document.getElementById('res-rate-gbps').textContent = fmt(bps / 1e9);
    document.getElementById('res-rate-terbps').textContent = fmt(bps / 1e12);
  }

  function switchConvPanel(name) {
    document.querySelectorAll('.conv-tab').forEach(t => t.classList.toggle('active', t.dataset.conv === name));
    document.querySelectorAll('.conv-panel').forEach(p => p.classList.toggle('active', p.id === `conv-${name}`));
  }

  function init() {
    document.getElementById('btn-ascii-convert').addEventListener('click', convertAscii);
    document.getElementById('btn-ieee-convert').addEventListener('click', convertIEEE754);
    document.getElementById('btn-storage-convert').addEventListener('click', convertStorage);
    document.getElementById('btn-rate-convert').addEventListener('click', convertDataRate);
    document.querySelectorAll('.conv-tab').forEach(tab => {
      tab.addEventListener('click', () => switchConvPanel(tab.dataset.conv));
    });
    renderAsciiTable();
  }

  return { init };
})();
