import React from 'react'

export default function Wire({ x1, y1, x2, y2, active, selected, onSelect }) {
  const dx = Math.max(40, Math.abs(x2 - x1) * 0.5)
  const d = `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`
  return (
    <g>
      {/* fat invisible hit target */}
      <path
        d={d}
        className="wire-hit"
        onPointerDown={(e) => {
          e.stopPropagation()
          onSelect()
        }}
      />
      <path
        d={d}
        className={`wire${active ? ' active' : ''}${selected ? ' selected' : ''}`}
      />
    </g>
  )
}
