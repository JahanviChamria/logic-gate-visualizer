import { useState, useCallback, useMemo } from 'react'
import { getInputCount } from '../engine/simulate.js'
import { GATE_W, GATE_H } from '../engine/gateShapes.js'

// Node geometry --------------------------------------------------------------
export const IO_W = 56
export const IO_H = 40

export function nodeSize(type) {
  if (type === 'INPUT' || type === 'OUTPUT') return { w: IO_W, h: IO_H }
  return { w: GATE_W, h: GATE_H }
}

// Absolute position of a port.
// kind: 'in' | 'out'. index: input port index.
export function getPortPos(node, kind, index = 0) {
  const { w, h } = nodeSize(node.type)
  if (kind === 'out') {
    return { x: node.x + w, y: node.y + h / 2 }
  }
  const count = getInputCount(node.type) || 1
  if (count === 1) return { x: node.x, y: node.y + h / 2 }
  const span = h - 16
  const step = span / (count - 1)
  return { x: node.x, y: node.y + 8 + step * index }
}

let _id = 0
function makeId(prefix) {
  _id += 1
  return `${prefix}_${_id}_${Math.random().toString(36).slice(2, 6)}`
}

// Example presets ------------------------------------------------------------
function halfAdder() {
  const a = { id: makeId('n'), type: 'INPUT', x: 60, y: 120, value: 0, label: 'A' }
  const b = { id: makeId('n'), type: 'INPUT', x: 60, y: 260, value: 0, label: 'B' }
  const xor = { id: makeId('n'), type: 'XOR', x: 260, y: 110 }
  const and = { id: makeId('n'), type: 'AND', x: 260, y: 250 }
  const sum = { id: makeId('n'), type: 'OUTPUT', x: 460, y: 120, label: 'Sum' }
  const carry = { id: makeId('n'), type: 'OUTPUT', x: 460, y: 260, label: 'Carry' }
  const nodes = [a, b, xor, and, sum, carry]
  const wires = [
    wire(a, 'out', 0, xor, 'in', 0),
    wire(b, 'out', 0, xor, 'in', 1),
    wire(a, 'out', 0, and, 'in', 0),
    wire(b, 'out', 0, and, 'in', 1),
    wire(xor, 'out', 0, sum, 'in', 0),
    wire(and, 'out', 0, carry, 'in', 0),
  ]
  return { nodes, wires }
}

function srLatch() {
  const s = { id: makeId('n'), type: 'INPUT', x: 60, y: 110, value: 0, label: 'S' }
  const r = { id: makeId('n'), type: 'INPUT', x: 60, y: 290, value: 0, label: 'R' }
  const nor1 = { id: makeId('n'), type: 'NOR', x: 280, y: 110 }
  const nor2 = { id: makeId('n'), type: 'NOR', x: 280, y: 280 }
  const q = { id: makeId('n'), type: 'OUTPUT', x: 480, y: 120, label: 'Q' }
  const qn = { id: makeId('n'), type: 'OUTPUT', x: 480, y: 290, label: "Q'" }
  const nodes = [s, r, nor1, nor2, q, qn]
  const wires = [
    wire(r, 'out', 0, nor1, 'in', 0),
    wire(s, 'out', 0, nor2, 'in', 1),
    wire(nor2, 'out', 0, nor1, 'in', 1),
    wire(nor1, 'out', 0, nor2, 'in', 0),
    wire(nor1, 'out', 0, q, 'in', 0),
    wire(nor2, 'out', 0, qn, 'in', 0),
  ]
  return { nodes, wires }
}

function majority3() {
  const a = { id: makeId('n'), type: 'INPUT', x: 50, y: 70, value: 0, label: 'A' }
  const b = { id: makeId('n'), type: 'INPUT', x: 50, y: 200, value: 0, label: 'B' }
  const c = { id: makeId('n'), type: 'INPUT', x: 50, y: 330, value: 0, label: 'C' }
  const ab = { id: makeId('n'), type: 'AND', x: 240, y: 90 }
  const bc = { id: makeId('n'), type: 'AND', x: 240, y: 220 }
  const ac = { id: makeId('n'), type: 'AND', x: 240, y: 350 }
  const or1 = { id: makeId('n'), type: 'OR', x: 430, y: 150 }
  const or2 = { id: makeId('n'), type: 'OR', x: 590, y: 240 }
  const out = { id: makeId('n'), type: 'OUTPUT', x: 760, y: 250, label: 'M' }
  const nodes = [a, b, c, ab, bc, ac, or1, or2, out]
  const wires = [
    wire(a, 'out', 0, ab, 'in', 0),
    wire(b, 'out', 0, ab, 'in', 1),
    wire(b, 'out', 0, bc, 'in', 0),
    wire(c, 'out', 0, bc, 'in', 1),
    wire(a, 'out', 0, ac, 'in', 0),
    wire(c, 'out', 0, ac, 'in', 1),
    wire(ab, 'out', 0, or1, 'in', 0),
    wire(bc, 'out', 0, or1, 'in', 1),
    wire(or1, 'out', 0, or2, 'in', 0),
    wire(ac, 'out', 0, or2, 'in', 1),
    wire(or2, 'out', 0, out, 'in', 0),
  ]
  return { nodes, wires }
}

function wire(from, _fk, fport, to, _tk, tport) {
  return {
    id: makeId('w'),
    from: { node: from.id, port: fport },
    to: { node: to.id, port: tport },
  }
}

export const EXAMPLES = {
  'Half Adder': halfAdder,
  'SR Latch': srLatch,
  '3-input Majority': majority3,
}

// Hook -----------------------------------------------------------------------
export function useCircuit() {
  const [nodes, setNodes] = useState([])
  const [wires, setWires] = useState([])

  const addNode = useCallback((type, x, y) => {
    const node = { id: makeId('n'), type, x, y }
    if (type === 'INPUT') node.value = 0
    setNodes((ns) => [...ns, node])
  }, [])

  const moveNode = useCallback((id, x, y) => {
    setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, x, y } : n)))
  }, [])

  const toggleInput = useCallback((id) => {
    setNodes((ns) =>
      ns.map((n) => (n.id === id ? { ...n, value: n.value ? 0 : 1 } : n))
    )
  }, [])

  const addWire = useCallback((from, to) => {
    setWires((ws) => {
      // Prevent duplicate wires into the same input port.
      const filtered = ws.filter(
        (w) => !(w.to.node === to.node && w.to.port === to.port)
      )
      if (from.node === to.node) return filtered
      return [...filtered, { id: makeId('w'), from, to }]
    })
  }, [])

  const deleteNode = useCallback((id) => {
    setNodes((ns) => ns.filter((n) => n.id !== id))
    setWires((ws) => ws.filter((w) => w.from.node !== id && w.to.node !== id))
  }, [])

  const deleteWire = useCallback((id) => {
    setWires((ws) => ws.filter((w) => w.id !== id))
  }, [])

  const clear = useCallback(() => {
    setNodes([])
    setWires([])
  }, [])

  const loadExample = useCallback((name) => {
    const fn = EXAMPLES[name]
    if (!fn) return
    const { nodes: n, wires: w } = fn()
    setNodes(n)
    setWires(w)
  }, [])

  return {
    nodes,
    wires,
    addNode,
    moveNode,
    toggleInput,
    addWire,
    deleteNode,
    deleteWire,
    clear,
    loadExample,
  }
}
