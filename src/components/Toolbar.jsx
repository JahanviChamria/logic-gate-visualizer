import React from 'react'
import { EXAMPLES } from '../hooks/useCircuit.js'

export default function Toolbar({ gateCount, wireCount, onClear, onLoadExample }) {
  return (
    <div className="toolbar">
      <span className="title">Logic Gate Visualizer</span>
      <select
        className="examples-select"
        value=""
        onChange={(e) => {
          if (e.target.value) onLoadExample(e.target.value)
          e.target.value = ''
        }}
      >
        <option value="">Examples…</option>
        {Object.keys(EXAMPLES).map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <button className="tool-btn" onClick={onClear}>
        Clear Canvas
      </button>
      <span className="counts">
        Gates: <b>{gateCount}</b> &nbsp; Wires: <b>{wireCount}</b>
      </span>
    </div>
  )
}
