import React from 'react'
import { getGateShape } from '../engine/gateShapes.js'
import { getInputCount } from '../engine/simulate.js'
import { nodeSize, getPortPos } from '../hooks/useCircuit.js'

export default function Gate({
  node,
  selected,
  onPointerDown,
  onPortClick,
  pendingPort,
}) {
  const shape = getGateShape(node.type)
  const { w, h } = nodeSize(node.type)
  const inCount = getInputCount(node.type)

  return (
    <g
      transform={`translate(${node.x},${node.y})`}
      className="gate"
      onPointerDown={(e) => onPointerDown(e, node.id)}
    >
      <path
        d={shape.body}
        className={selected ? 'gate-body selected' : 'gate-body'}
      />
      {shape.extra && <path d={shape.extra} className="gate-extra" />}
      {shape.bubble && (
        <circle
          cx={shape.bubble.cx}
          cy={shape.bubble.cy}
          r={shape.bubble.r}
          className="gate-body"
        />
      )}
      <text x={w / 2} y={h / 2 + 4} className="gate-label">
        {node.type}
      </text>

      {/* input ports */}
      {Array.from({ length: inCount }).map((_, i) => {
        const p = getPortPos(node, 'in', i)
        const isPending =
          pendingPort &&
          pendingPort.kind === 'in' &&
          pendingPort.node === node.id &&
          pendingPort.port === i
        return (
          <circle
            key={`in-${i}`}
            cx={p.x - node.x}
            cy={p.y - node.y}
            r={5}
            className={`port port-in${isPending ? ' pending' : ''}`}
            onPointerDown={(e) => {
              e.stopPropagation()
              onPortClick(node.id, 'in', i)
            }}
          />
        )
      })}

      {/* output port */}
      {(() => {
        const p = getPortPos(node, 'out', 0)
        const isPending =
          pendingPort &&
          pendingPort.kind === 'out' &&
          pendingPort.node === node.id
        return (
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
        )
      })()}
    </g>
  )
}
