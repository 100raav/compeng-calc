const NetworkCalc = (() => {
  function ipToInt(ip) {
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return null;
    return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
  }

  function intToIp(int) {
    return [
      (int >>> 24) & 255,
      (int >>> 16) & 255,
      (int >>> 8) & 255,
      int & 255
    ].join('.');
  }

  function getIpClass(ip) {
    const first = parseInt(ip.split('.')[0]);
    if (first >= 1 && first <= 126) return 'A';
    if (first >= 128 && first <= 191) return 'B';
    if (first >= 192 && first <= 223) return 'C';
    if (first >= 224 && first <= 239) return 'D (Multicast)';
    if (first >= 240 && first <= 255) return 'E (Reserved)';
    return 'N/A';
  }

  function getIpType(ip) {
    const parts = ip.split('.').map(Number);
    if (parts[0] === 10) return 'Private';
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return 'Private';
    if (parts[0] === 192 && parts[1] === 168) return 'Private';
    if (parts[0] === 127) return 'Loopback';
    if (parts[0] === 0) return 'This network';
    if (parts[0] === 255 && parts[1] === 255 && parts[2] === 255 && parts[3] === 255) return 'Broadcast';
    return 'Public';
  }

  function subnetCalc() {
    const ip = [
      document.getElementById('ip1').value,
      document.getElementById('ip2').value,
      document.getElementById('ip3').value,
      document.getElementById('ip4').value
    ].join('.');
    const cidr = parseInt(document.getElementById('cidr').value);

    if (!ip.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) { alert('Invalid IP address'); return; }
    const parts = ip.split('.').map(Number);
    if (parts.some(p => p < 0 || p > 255)) { alert('Invalid IP octet'); return; }
    if (isNaN(cidr) || cidr < 0 || cidr > 32) { alert('Invalid CIDR (0-32)'); return; }

    const ipInt = ipToInt(ip);
    const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const wildcard = (~mask) >>> 0;
    const network = (ipInt & mask) >>> 0;
    const broadcast = (network | wildcard) >>> 0;
    const firstHost = cidr >= 31 ? network : (network + 1) >>> 0;
    const lastHost = cidr >= 31 ? broadcast : (broadcast - 1) >>> 0;
    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : totalHosts - 2;

    document.getElementById('res-network').textContent = intToIp(network);
    document.getElementById('res-broadcast').textContent = intToIp(broadcast);
    document.getElementById('res-mask').textContent = intToIp(mask);
    document.getElementById('res-wildcard').textContent = intToIp(wildcard);
    document.getElementById('res-first').textContent = cidr >= 31 ? 'N/A' : intToIp(firstHost);
    document.getElementById('res-last').textContent = cidr >= 31 ? 'N/A' : intToIp(lastHost);
    document.getElementById('res-total').textContent = totalHosts.toLocaleString();
    document.getElementById('res-usable').textContent = usableHosts.toLocaleString();
    document.getElementById('res-class').textContent = getIpClass(ip);
    document.getElementById('res-type').textContent = getIpType(ip);
  }

  function ipToIntCalc() {
    const ip = document.getElementById('ip-int-ip').value.trim();
    const intVal = ipToInt(ip);
    if (intVal === null) { document.getElementById('res-ip-int').textContent = 'Invalid IP'; return; }
    document.getElementById('res-ip-int').textContent = intVal.toLocaleString();
  }

  function intToIpCalc() {
    const val = parseInt(document.getElementById('int-ip').value.trim());
    if (isNaN(val) || val < 0 || val > 4294967295) { document.getElementById('res-int-ip').textContent = 'Invalid integer'; return; }
    document.getElementById('res-int-ip').textContent = intToIp(val >>> 0);
  }

  function cidrRange() {
    const input = document.getElementById('cidr-range').value.trim();
    const match = input.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/);
    if (!match) { document.getElementById('res-cidr-range').textContent = 'Use format: IP/CIDR'; return; }
    const ipInt = ipToInt(match[1]);
    const cidr = parseInt(match[2]);
    if (ipInt === null || cidr < 0 || cidr > 32) { document.getElementById('res-cidr-range').textContent = 'Invalid input'; return; }
    const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const wildcard = (~mask) >>> 0;
    const network = (ipInt & mask) >>> 0;
    const broadcast = (network | wildcard) >>> 0;
    document.getElementById('res-cidr-range').textContent = `${intToIp(network)} — ${intToIp(broadcast)}`;
  }

  function init() {
    document.getElementById('btn-subnet-calc').addEventListener('click', subnetCalc);
    document.getElementById('btn-ip-int').addEventListener('click', ipToIntCalc);
    document.getElementById('btn-int-ip').addEventListener('click', intToIpCalc);
    document.getElementById('btn-cidr-range').addEventListener('click', cidrRange);

    document.querySelectorAll('.ip-field').forEach((field, i, fields) => {
      field.addEventListener('input', () => {
        if (field.value.length >= 3 && i < 3) fields[i + 1].focus();
      });
      field.addEventListener('keydown', (e) => {
        if (e.key === '.' && i < 3) { e.preventDefault(); fields[i + 1].focus(); }
      });
    });
  }

  return { init };
})();
