import React, { useMemo, useRef } from 'react'
import Toolbar from './components/Toolbar.jsx'
import GatePalette from './components/GatePalette.jsx'
import Canvas from './components/Canvas.jsx'
import TruthTable from './components/TruthTable.jsx'
import HardwarePanel from './components/HardwarePanel.jsx'
import { useCircuit } from './hooks/useCircuit.js'
import { simulate } from './engine/simulate.js'

export default function App() {
  const circuit = useCircuit()
  const placeRef = useRef(0)

  const { values, wireValues } = useMemo(
    () => simulate(circuit.nodes, circuit.wires),
    [circuit.nodes, circuit.wires]
  )

  const handleAdd = (type) => {
    const i = placeRef.current++
    const x = 180 + (i % 5) * 40
    const y = 100 + (i % 7) * 40
    circuit.addNode(type, x, y)
  }

  const gateCount = circuit.nodes.filter(
    (n) => n.type !== 'INPUT' && n.type !== 'OUTPUT'
  ).length

  const inputNodes = circuit.nodes
    .filter((n) => n.type === 'INPUT')
    .map((n) => ({ ...n, value: values[n.id] ?? 0 }))
  const outputNodes = circuit.nodes
    .filter((n) => n.type === 'OUTPUT')
    .map((n) => ({ ...n, value: values[n.id] ?? 0 }))

  return (
    <div className="app">
      <Toolbar
        gateCount={gateCount}
        wireCount={circuit.wires.length}
        onClear={circuit.clear}
        onLoadExample={circuit.loadExample}
      />
      <div className="main">
        <GatePalette onAdd={handleAdd} />
        <Canvas
          nodes={circuit.nodes}
          wires={circuit.wires}
          values={values}
          wireValues={wireValues}
          moveNode={circuit.moveNode}
          toggleInput={circuit.toggleInput}
          addWire={circuit.addWire}
          deleteNode={circuit.deleteNode}
          deleteWire={circuit.deleteWire}
        />
        <TruthTable nodes={circuit.nodes} wires={circuit.wires} />
      </div>
      <HardwarePanel
        inputs={inputNodes}
        outputs={outputNodes}
        onToggleInput={circuit.toggleInput}
      />
    </div>
  )
}
