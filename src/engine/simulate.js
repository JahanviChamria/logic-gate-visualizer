// Logic gate simulation engine: topological sort + evaluation.

// Number of input ports for each node type.
export const INPUT_COUNT = {
  INPUT: 0,
  OUTPUT: 1,
  NOT: 1,
  BUFFER: 1,
  AND: 2,
  OR: 2,
  NAND: 2,
  NOR: 2,
  XOR: 2,
  XNOR: 2,
}

export const GATE_TYPES = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR', 'BUFFER']

export function getInputCount(type) {
  return INPUT_COUNT[type] ?? 2
}

function evalGate(type, inputs) {
  // inputs is an array of 0/1 (undefined treated as 0)
  const v = inputs.map((x) => (x ? 1 : 0))
  const ones = v.reduce((a, b) => a + b, 0)
  switch (type) {
    case 'AND':
      return v.length > 0 && v.every((x) => x === 1) ? 1 : 0
    case 'OR':
      return v.some((x) => x === 1) ? 1 : 0
    case 'NOT':
      return v[0] ? 0 : 1
    case 'BUFFER':
      return v[0] ? 1 : 0
    case 'NAND':
      return v.length > 0 && v.every((x) => x === 1) ? 0 : 1
    case 'NOR':
      return v.some((x) => x === 1) ? 0 : 1
    case 'XOR':
      return ones % 2 === 1 ? 1 : 0
    case 'XNOR':
      return ones % 2 === 0 ? 1 : 0
    default:
      return 0
  }
}

/**
 * Simulate the circuit.
 * @param {Array} nodes  [{id, type, value?}]
 * @param {Array} wires  [{id, from:{node, port}, to:{node, port}}]
 * @param {Object} overrideInputs  optional map nodeId -> 0/1 to override INPUT values
 * @returns {{ values: Object, wireValues: Object }}
 *   values: nodeId -> output value (0/1)
 *   wireValues: wireId -> 0/1
 */
export function simulate(nodes, wires, overrideInputs = null) {
  const nodeMap = {}
  nodes.forEach((n) => (nodeMap[n.id] = n))

  // Build adjacency: for each node, which nodes feed into it.
  const incoming = {} // nodeId -> array of {port, fromNode}
  nodes.forEach((n) => (incoming[n.id] = []))
  wires.forEach((w) => {
    if (incoming[w.to.node]) {
      incoming[w.to.node].push({ port: w.to.port, fromNode: w.from.node })
    }
  })

  // Topological order via Kahn's algorithm.
  const indeg = {}
  const adj = {} // fromNode -> [toNode]
  nodes.forEach((n) => {
    indeg[n.id] = 0
    adj[n.id] = []
  })
  wires.forEach((w) => {
    if (nodeMap[w.from.node] && nodeMap[w.to.node]) {
      adj[w.from.node].push(w.to.node)
      indeg[w.to.node]++
    }
  })

  const queue = []
  nodes.forEach((n) => {
    if (indeg[n.id] === 0) queue.push(n.id)
  })
  const order = []
  while (queue.length) {
    const id = queue.shift()
    order.push(id)
    adj[id].forEach((t) => {
      indeg[t]--
      if (indeg[t] === 0) queue.push(t)
    })
  }
  // Any nodes left out (cycles, e.g. SR latch) get appended; they are
  // evaluated with whatever upstream values are available so far.
  nodes.forEach((n) => {
    if (!order.includes(n.id)) order.push(n.id)
  })

  const values = {}
  // Initialize all to 0 so cyclic feedback has a defined starting state.
  nodes.forEach((n) => (values[n.id] = 0))

  // For cyclic circuits, iterate a few times to settle.
  const passes = 1 + wires.length
  for (let pass = 0; pass < passes; pass++) {
    let changed = false
    for (const id of order) {
      const node = nodeMap[id]
      let out
      if (node.type === 'INPUT') {
        out =
          overrideInputs && overrideInputs[id] !== undefined
            ? overrideInputs[id]
            : node.value
              ? 1
              : 0
      } else if (node.type === 'OUTPUT') {
        const src = incoming[id][0]
        out = src ? values[src.fromNode] : 0
      } else {
        const count = getInputCount(node.type)
        const inputs = new Array(count).fill(0)
        incoming[id].forEach(({ port, fromNode }) => {
          if (port < count) inputs[port] = values[fromNode]
        })
        out = evalGate(node.type, inputs)
      }
      if (values[id] !== out) {
        values[id] = out
        changed = true
      }
    }
    if (!changed) break
  }

  const wireValues = {}
  wires.forEach((w) => {
    wireValues[w.id] = values[w.from.node] ? 1 : 0
  })

  return { values, wireValues }
}
