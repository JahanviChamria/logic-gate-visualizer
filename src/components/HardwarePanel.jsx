import React from 'react'
import SevenSegment from './SevenSegment.jsx'

export default function HardwarePanel({ inputs, outputs, onToggleInput }) {
  // Interpret the output nodes as a binary number (first output = MSB).
  const decimal = outputs.reduce((acc, o) => acc * 2 + (o.value ? 1 : 0), 0)
  const digitCount = Math.max(1, String(decimal).length)
  const digits = String(decimal).padStart(digitCount, ' ').split('')

  return (
    <div className="hw-panel">
      <div className="hw-block">
        <div className="hw-title">Input Switches</div>
        <div className="hw-row">
          {inputs.length === 0 && <span className="hw-empty">no inputs</span>}
          {inputs.map((n, i) => (
            <div className="switch-wrap" key={n.id}>
              <button
                className={`switch ${n.value ? 'on' : 'off'}`}
                onClick={() => onToggleInput(n.id)}
                title="Toggle"
              >
                <span className="switch-knob" />
              </button>
              <span className="switch-label">{n.label || `I${i + 1}`}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hw-block">
        <div className="hw-title">Output LEDs</div>
        <div className="hw-row">
          {outputs.length === 0 && <span className="hw-empty">no outputs</span>}
          {outputs.map((n, i) => (
            <div className="led-wrap" key={n.id}>
              <span className={`led ${n.value ? 'on' : 'off'}`} />
              <span className="led-label">{n.label || `O${i + 1}`}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hw-block hw-display-block">
        <div className="hw-title">Decimal Readout</div>
        <div className="hw-display">
          {digits.map((d, i) => (
            <SevenSegment key={i} value={d} />
          ))}
        </div>
        <div className="hw-binary">
          {outputs.length
            ? outputs.map((o) => (o.value ? 1 : 0)).join('')
            : '—'}
          <span className="hw-bin-tag">bin</span>
        </div>
      </div>
    </div>
  )
}
