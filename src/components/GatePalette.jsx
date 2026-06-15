import React from 'react'
import { GATE_TYPES } from '../engine/simulate.js'

export default function GatePalette({ onAdd }) {
  return (
    <div className="palette">
      <h2>Palette</h2>
      <div className="palette-section">I/O</div>
      <button className="palette-btn io" onClick={() => onAdd('INPUT')}>
        Input
      </button>
      <button className="palette-btn io" onClick={() => onAdd('OUTPUT')}>
        Output
      </button>
      <div className="palette-section">Gates</div>
      {GATE_TYPES.map((t) => (
        <button key={t} className="palette-btn" onClick={() => onAdd(t)}>
          {t}
        </button>
      ))}
      <p className="palette-hint">
        Click to place. Drag to move. Click an output port then an input port to
        wire. Select &amp; press Backspace to delete.
      </p>
    </div>
  )
}
