import React from 'react'
import { nodeSize, getPortPos } from '../hooks/useCircuit.js'

export default function InputNode({
  node,
  value,
  selected,
  onPointerDown,
  onToggle,
  onPortClick,
  pendingPort,
}) {
  const { w, h } = nodeSize(node.type)
  const p = getPortPos(node, 'out', 0)
  const isPending =
    pendingPort && pendingPort.kind === 'out' && pendingPort.node === node.id

  return (
    <g
      transform={`translate(${node.x},${node.y})`}
      onPointerDown={(e) => onPointerDown(e, node.id)}
    >
      <rect
        width={w}
        height={h}
        rx={6}
        className={`io-node input-node val-${value}${selected ? ' selected' : ''}`}
        onPointerDown={(e) => {
          e.stopPropagation()
          onPointerDown(e, node.id)
        }}
        onClick={(e) => {
          e.stopPropagation()
          onToggle(node.id)
        }}
      />
      <text x={w / 2} y={h / 2 + 6} className="io-value">
        {value}
      </text>
      {node.label && (
        <text x={w / 2} y={-6} className="io-label">
          {node.label}
        </text>
      )}
      <circle
        cx={p.x - node.x}
        cy={p.y - node.y}
        r={5}
        className={`port port-out${isPending ? ' pending' : ''}`}
        onPointerDown={(e) => {
          e.stopPropagation()
          onPortClick(node.id, 'out', 0)
        }}
      />
    </g>
  )
}
