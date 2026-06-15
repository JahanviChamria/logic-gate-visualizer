import React, { useMemo } from 'react'
import { simulate } from '../engine/simulate.js'

export default function TruthTable({ nodes, wires }) {
  const inputs = useMemo(
    () => nodes.filter((n) => n.type === 'INPUT'),
    [nodes]
  )
  const outputs = useMemo(
    () => nodes.filter((n) => n.type === 'OUTPUT'),
    [nodes]
  )

  const data = useMemo(() => {
    if (inputs.length === 0 || outputs.length === 0) return null
    if (inputs.length > 8) return 'too-many'
    const rows = []
    const combos = 1 << inputs.length
    for (let mask = 0; mask < combos; mask++) {
      const override = {}
      const inVals = []
      inputs.forEach((inp, i) => {
        // MSB first for readability
        const bit = (mask >> (inputs.length - 1 - i)) & 1
        override[inp.id] = bit
        inVals.push(bit)
      })
      const { values } = simulate(nodes, wires, override)
      const outVals = outputs.map((o) => values[o.id] ?? 0)
      rows.push({ inVals, outVals })
    }
    return rows
  }, [nodes, wires, inputs, outputs])

  const currentInputs = inputs.map((n) => (n.value ? 1 : 0))

  const label = (n, i, kind) =>
    n.label || `${kind}${i + 1}`

  if (!data) {
    return (
      <div className="truth-table">
        <h2>Truth Table</h2>
        <p className="tt-empty">
          Add at least one Input and one Output node to generate a truth table.
        </p>
      </div>
    )
  }

  if (data === 'too-many') {
    return (
      <div className="truth-table">
        <h2>Truth Table</h2>
        <p className="tt-empty">Too many inputs ({inputs.length}) to enumerate.</p>
      </div>
    )
  }

  return (
    <div className="truth-table">
      <h2>Truth Table</h2>
      <table>
        <thead>
          <tr>
            {inputs.map((n, i) => (
              <th key={n.id} className="th-in">
                {label(n, i, 'I')}
              </th>
            ))}
            {outputs.map((n, i) => (
              <th key={n.id} className="th-out">
                {label(n, i, 'O')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, ri) => {
            const isCurrent =
              row.inVals.length === currentInputs.length &&
              row.inVals.every((v, i) => v === currentInputs[i])
            return (
              <tr key={ri} className={isCurrent ? 'current' : ''}>
                {row.inVals.map((v, i) => (
                  <td key={`i${i}`}>{v}</td>
                ))}
                {row.outVals.map((v, i) => (
                  <td key={`o${i}`} className={v ? 'on' : 'off'}>
                    {v}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
