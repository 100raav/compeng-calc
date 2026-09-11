<div align="center">

# CompEngCalc

### Professional Computer Engineering Calculator

**A full-featured engineering calculator for programmers, network engineers, and students — wrapped in a premium glassmorphism interface that works on every device.**

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/Built%20With-Vanilla%20JS%20·%20HTML%20·%20CSS-f7df1e)](#)
[![No Dependencies](https://img.shields.io/badge/Zero-Dependencies-00d4ff)](#)
[![Responsive](https://img.shields.io/badge/Fully-Responsive-00ff88)](#)

---

</div>

## 📖 Overview

CompEngCalc is a purpose-built calculator for **computer engineering workflows**. It bundles five professional calculators into a single, elegant interface:

| Mode | Purpose |
|------|---------|
| 🧮 **Basic** | Every-day arithmetic with decimal precision |
| 💻 **Programmer** | Number-base systems, bitwise logic, and complements |
| 🔬 **Scientific** | Advanced math with true order-of-operations parsing |
| 🌐 **Network** | IPv4 subnetting, CIDR, and IP math |
| 🔄 **Converter** | ASCII, IEEE-754, storage, and data-rate units |

The application runs **entirely in the browser** — no frameworks, no build steps, no dependencies. Open it, and it works everywhere: desktop, tablet, and mobile.

---

## ✨ Features

### 🧮 Basic Calculator
- Full arithmetic: addition, subtraction, multiplication, division
- Percentage, sign toggle, backspace, and all-clear
- 12-digit precision with smart scientific-notation fallback
- Full **keyboard support**
- Rich, cross-mode **calculation history**

### 💻 Programmer Calculator
- **Live base conversion** — DEC, HEX, OCT, and BIN shown simultaneously
- **Visual bit-field display** with grouped nibbles and byte separators
- Context-aware keypad — A–F digits enable only in HEX mode; 8–9 restricted in OCT; 2–9 restricted in BIN
- **Bitwise operations:** `AND`, `OR`, `XOR`, `NAND`, `NOR`, `XNOR`, `NOT`
- **Bit shifts:** logical left (`<< 1`) and right (`>> 1`)
- **Complements:** 1's and 2's complement
- Unsigned 32-bit integer semantics for accurate hardware math

### 🔬 Scientific Calculator
- **True expression engine** with full order-of-operations parsing
  - Precedence: parentheses → exponent (`^`) → multiply/divide/modulo → add/subtract
  - Unary minus support (`−5 + 10`)
  - Parenthesis nesting
- **Trigonometry:** `sin`, `cos`, `tan` and inverses `sin⁻¹`, `cos⁻¹`, `tan⁻¹`
- **Logarithms:** base-10 `log`, natural `ln`
- **Powers & roots:** `x²`, `x³`, `eˣ`, `10ˣ`, `√`, `∛`, `x^y`
- **Special functions:** factorial `n!` (including fractional extension via the gamma function), `|x|`, reciprocal `1/x`
- **Constants:** π and Euler's number e
- Modulo arithmetic and percentage

### 🌐 Network Calculator
- **IPv4 Subnet Calculator** — input `IP` + `CIDR` and instantly get:
  - Network address, broadcast address, subnet mask, wildcard mask
  - First & last usable host addresses
  - Total and usable host counts
  - **IP class detection** (A–E)
  - **Public / Private / Loopback / Reserved** classification
- **IP ↔ Integer** conversion both directions
- **CIDR ↔ IP range** expansion (e.g., `192.168.1.0/24` → `192.168.1.0 — 192.168.1.255`)
- Smart input jumps between IP octets

### 🔄 Converter Calculator
- **ASCII / Hex converter** — text ↔ decimal ↔ hex ↔ binary ↔ octal, with a highlighted live lookup table
- **IEEE 754 (single-precision)** — full 32-bit layout: sign bit, 8-bit exponent, 23-bit mantissa, plus the floating-point formula
- **Storage units** — bits, bytes, KB, MB, GB, TB, PB
- **Data-rate units** — bps, Kbps, Mbps, Gbps, Tbps, and byte-rate equivalents

---

## 🎨 Design System — Glassmorphism

The interface follows modern glassmorphism design principles:

- **Frosted-glass panels** via `backdrop-filter: blur()` with semi-transparent surfaces (with `-webkit-` fallback for Safari)
- **Animated gradient mesh background** — four slowly drifting color blobs create depth behind the glass
- **Mode-tinted accents** — each mode carries its own identity:
  - Basic → cyan · Programmer → green · Scientific → purple · Network → orange · Converter → pink
- **Depth & elevation** — layered shadows, 1px light borders, and subtle hover elevation
- **Motion** — smooth 200 ms transitions, tactile press-down scaling, and grid-tab switching
- **Typography** — JetBrains Mono for numerical displays, Inter for interface labels

**Performance-conscious:** blur is capped on readouts, and glass elements are limited per viewport for smooth GPU rendering.

### 📱 Responsive & Cross-Device
| Breakpoint | Layout |
|-----------|--------|
| ≤ 480 px | Compact single-column, condensed buttons, stacked results |
| 480–768 px | Adapted grids, sliding bottom-sheet history |
| 768–1024 px | Refined tablet layout |
| > 1024 px | Full desktop layout with slide-in history sidebar |

Optimized for all devices with touch-friendly targets, `-webkit-tap-highlight` removal, and focus states.

---

## 🚀 Getting Started

### Requirements
- Any modern browser (Chrome, Firefox, Safari, Edge) — no installation required
- *Optional:* Node.js ≥ 18 to serve the app locally

### Quick Start (Open Directly)
Just open `index.html` in your browser:

```bash
open index.html
```

### Recommended (Local Server)
For the best experience, serve the project from a local HTTP server:

```bash
python3 -m [http.server 8000](https://compeng-calc.vercel.app/)
# or
npx serve .
```

Then visit **[(https://compeng-calc.vercel.app/)](https://compeng-calc.vercel.app/)**.

---

## ⌨️ Keyboard Shortcuts

The keypad is fully keyboard-accessible (works whenever inputs aren't focused):

| Key | Action |
|-----|--------|
| `0–9` | Enter digit |
| `.` | Decimal point |
| `+` `-` `*` `/` | Arithmetic operators |
| `Enter` or `=` | Calculate |
| `Backspace` | Delete last character |
| `Esc` or `Delete` | Clear all |
| `%` | Percent |

---

## 🗂️ Project Structure

```
sureshiya/
├── index.html            # Application entry point, all mode markup
├── css/
│   └── styles.css        # Glassmorphism theme, design system, responsive rules
├── js/
│   ├── app.js            # Main controller — mode switching, keyboard, history
│   ├── basic.js          # Basic arithmetic calculator
│   ├── programmer.js     # Base systems, bitwise ops, shifts, complements
│   ├── scientific.js     # Expression engine, trig, logs, powers, constants
│   ├── network.js        # IPv4 subnet, CIDR, IP ↔ integer
│   └── converter.js      # ASCII, IEEE-754, storage & data-rate units
└── assets/
    └── favicon.svg       # Microchip icon
```

### Architecture Notes
- **Modular IIFE pattern** — each calculator is a self-contained module exposing a small API (`handleAction`, `updateDisplay`, etc.)
- **Shared display bus** — modules write to a single display panel via a shared controller
- **Event delegation** — buttons are handled centrally through `data-action` / `data-value` attributes
- **CSV-free design** — zero external runtimes; only Google Fonts is loaded externally

---

## 🧪 Verification & Testing

Core calculation logic was validated across:

- **Order-of-operations engine** — 12/12 precedence & parenthesis cases pass
- **Subnet math** — network/broadcast/host-range calculations verified against known values
- **Bitwise & shift semantics** — unsigned 32-bit behavior confirmed
- **IEEE-754 layout** — sign/exponent/mantissa extraction confirmed byte-accurate
- **DOM integrity** — all 71 referenced element IDs verified present in the HTML
- All modules pass `node --check` syntax validation

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

Please keep the **zero-dependency** philosophy and the glassmorphism design language intact.

---

## 🧑‍💻 Author

**Saurav Kumar Bichha** ([100raav](https://github.com/100raav))

Built with a focus on engineering accuracy, accessible design, and a clean developer experience.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**CompEngCalc** — *Calculators designed for how engineers actually think.*

Made with ❤️ for the engineering community.

</div>
