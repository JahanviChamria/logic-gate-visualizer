# Logic Gate Visualizer

An interactive logic gate circuit simulator built with **Vite + React** and rendered entirely with SVG — no external UI libraries.

## Features

- **Gate palette** — AND, OR, NOT, NAND, NOR, XOR, XNOR, BUFFER, plus Input/Output nodes.
- **Drag-and-drop canvas** with IEEE/ANSI gate symbols and click-to-wire ports.
- **Live simulation** — topological-sort evaluation that updates outputs in real time; active wires animate.
- **Truth table** auto-generated from the circuit's inputs and outputs, with the current state highlighted.
- **Hardware deck** — toggle switches, output LEDs, and a 7-segment decimal readout of the output bus.
- **Preset examples** — Half Adder, SR Latch, and a 3-input Majority gate.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Project structure

```
src/
  components/   Canvas, Gate, Wire, InputNode, OutputNode, GatePalette,
                Toolbar, TruthTable, HardwarePanel, SevenSegment
  engine/       simulate.js (topo sort + gate logic), gateShapes.js (SVG symbols)
  hooks/        useCircuit.js (circuit state + example presets)
```
