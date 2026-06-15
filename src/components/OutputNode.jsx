import React from 'react'
import { nodeSize, getPortPos } from '../hooks/useCircuit.js'

export default function OutputNode({
  node,
  value,
  selected,
  onPointerDown,
  onPortClick,
  pendingPort,
}) {
  const { w, h } = nodeSize(node.type)
  const p = getPortPos(node, 'in', 0)
  const isPending =
    pendingPort &&
    pendingPort.kind === 'in' &&
    pendingPort.node === node.id &&
    pendingPort.port === 0

  return (
    <g
      transform={`translate(${node.x},${node.y})`}
      onPointerDown={(e) => onPointerDown(e, node.id)}
    >
      <circle
        cx={w / 2}
        cy={h / 2}
        r={h / 2}
        className={`io-node output-node val-${value}${selected ? ' selected' : ''}`}
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
        className={`port port-in${isPending ? ' pending' : ''}`}
        onPointerDown={(e) => {
          e.stopPropagation()
          onPortClick(node.id, 'in', 0)
        }}
      />
    </g>
  )
}
