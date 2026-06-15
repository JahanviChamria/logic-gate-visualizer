// SVG symbol definitions for each logic gate.
// All shapes are drawn in a local box: x in [0..GATE_W], y in [0..GATE_H].
// Output port sits at x = GATE_W (right), input ports on the left at x = 0.

export const GATE_W = 70
export const GATE_H = 48

// AND / NAND body (D-shape)
const AND_BODY = 'M8,4 L34,4 A20,20 0 0 1 34,44 L8,44 Z'
// OR / NOR / XOR / XNOR body
const OR_BODY = 'M8,4 Q36,4 58,24 Q36,44 8,44 Q22,24 8,4 Z'
// Buffer / NOT triangle
const TRI_BODY = 'M10,4 L10,44 L56,24 Z'
// Extra input arc for XOR / XNOR
const XOR_ARC = 'M2,4 Q16,24 2,44'

/**
 * Returns a description of how to render the gate symbol.
 * { body, secondBody?, bubble?, outputX, bodyEndX }
 */
export function getGateShape(type) {
  switch (type) {
    case 'AND':
      return { body: AND_BODY, bodyEndX: 54 }
    case 'NAND':
      return { body: AND_BODY, bubble: { cx: 60, cy: 24, r: 5 }, bodyEndX: 54 }
    case 'OR':
      return { body: OR_BODY, bodyEndX: 58 }
    case 'NOR':
      return { body: OR_BODY, bubble: { cx: 64, cy: 24, r: 5 }, bodyEndX: 58 }
    case 'XOR':
      return { body: OR_BODY, extra: XOR_ARC, bodyEndX: 58 }
    case 'XNOR':
      return {
        body: OR_BODY,
        extra: XOR_ARC,
        bubble: { cx: 64, cy: 24, r: 5 },
        bodyEndX: 58,
      }
    case 'BUFFER':
      return { body: TRI_BODY, bodyEndX: 56 }
    case 'NOT':
      return { body: TRI_BODY, bubble: { cx: 61, cy: 24, r: 5 }, bodyEndX: 56 }
    default:
      return { body: AND_BODY, bodyEndX: 54 }
  }
}
