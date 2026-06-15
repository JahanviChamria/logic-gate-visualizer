import React, { useRef, useState, useCallback, useEffect } from 'react'
import Gate from './Gate.jsx'
import Wire from './Wire.jsx'
import InputNode from './InputNode.jsx'
import OutputNode from './OutputNode.jsx'
import { getPortPos } from '../hooks/useCircuit.js'

export default function Canvas({
  nodes,
  wires,
  values,
  wireValues,
  moveNode,
  toggleInput,
  addWire,
  deleteNode,
  deleteWire,
}) {
  const svgRef = useRef(null)
  const [selected, setSelected] = useState(null) // {kind:'node'|'wire', id}
  const [pendingPort, setPendingPort] = useState(null) // {node, kind, port}
  const dragRef = useRef(null) // {id, offX, offY, moved}

  const nodeById = (id) => nodes.find((n) => n.id === id)

  const toSvg = useCallback((e) => {
    const rect = svgRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }, [])

  const handleNodePointerDown = useCallback(
    (e, id) => {
      e.stopPropagation()
      const node = nodeById(id)
      if (!node) return
      const p = toSvg(e)
      dragRef.current = {
        id,
        offX: p.x - node.x,
        offY: p.y - node.y,
        moved: false,
      }
      setSelected({ kind: 'node', id })
    },
    [nodes, toSvg]
  )

  const handlePointerMove = useCallback(
    (e) => {
      if (!dragRef.current) return
      const p = toSvg(e)
      dragRef.current.moved = true
      moveNode(
        dragRef.current.id,
        p.x - dragRef.current.offX,
        p.y - dragRef.current.offY
      )
    },
    [moveNode, toSvg]
  )

  const handlePointerUp = useCallback(() => {
    dragRef.current = null
  }, [])

  const handlePortClick = useCallback(
    (nodeId, kind, port) => {
      if (!pendingPort) {
        setPendingPort({ node: nodeId, kind, port })
        return
      }
      // Need one 'out' and one 'in'
      if (pendingPort.kind === kind) {
        // replace selection
        setPendingPort({ node: nodeId, kind, port })
        return
      }
      const out = pendingPort.kind === 'out' ? pendingPort : { node: nodeId, port }
      const inp = pendingPort.kind === 'in' ? pendingPort : { node: nodeId, port }
      addWire(
        { node: out.node, port: out.port },
        { node: inp.node, port: inp.port }
      )
      setPendingPort(null)
    },
    [pendingPort, addWire]
  )

  const handleBackgroundDown = useCallback(() => {
    setSelected(null)
    setPendingPort(null)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (!selected) return
        e.preventDefault()
        if (selected.kind === 'node') deleteNode(selected.id)
        else deleteWire(selected.id)
        setSelected(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, deleteNode, deleteWire])

  return (
    <svg
      ref={svgRef}
      className="canvas"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerDown={handleBackgroundDown}
    >
      {/* grid */}
      <defs>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24,0 L0,0 0,24" fill="none" stroke="#23233f" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* wires */}
      {wires.map((w) => {
        const from = nodeById(w.from.node)
        const to = nodeById(w.to.node)
        if (!from || !to) return null
        const a = getPortPos(from, 'out', 0)
        const b = getPortPos(to, 'in', w.to.port)
        return (
          <Wire
            key={w.id}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            active={wireValues[w.id] === 1}
            selected={selected?.kind === 'wire' && selected.id === w.id}
            onSelect={() => setSelected({ kind: 'wire', id: w.id })}
          />
        )
      })}

      {/* nodes */}
      {nodes.map((n) => {
        const isSel = selected?.kind === 'node' && selected.id === n.id
        if (n.type === 'INPUT') {
          return (
            <InputNode
              key={n.id}
              node={n}
              value={values[n.id] ?? 0}
              selected={isSel}
              onPointerDown={handleNodePointerDown}
              onToggle={(id) => {
                if (!dragRef.current?.moved) toggleInput(id)
              }}
              onPortClick={handlePortClick}
              pendingPort={pendingPort}
            />
          )
        }
        if (n.type === 'OUTPUT') {
          return (
            <OutputNode
              key={n.id}
              node={n}
              value={values[n.id] ?? 0}
              selected={isSel}
              onPointerDown={handleNodePointerDown}
              onPortClick={handlePortClick}
              pendingPort={pendingPort}
            />
          )
        }
        return (
          <Gate
            key={n.id}
            node={n}
            selected={isSel}
            onPointerDown={handleNodePointerDown}
            onPortClick={handlePortClick}
            pendingPort={pendingPort}
          />
        )
      })}
    </svg>
  )
}
