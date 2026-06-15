import React from 'react'

// Segment layout:
//   aaa
//  f   b
//  f   b
//   ggg
//  e   c
//  e   c
//   ddd
const DIGITS = {
  0: 'abcdef',
  1: 'bc',
  2: 'abged',
  3: 'abgcd',
  4: 'fgbc',
  5: 'afgcd',
  6: 'afgcde',
  7: 'abc',
  8: 'abcdefg',
  9: 'abcdfg',
  '-': 'g',
  ' ': '',
}

// Polygon points for each segment within a 0..50 x 0..90 box.
const SEG = {
  a: '8,4 42,4 36,10 14,10',
  b: '44,6 44,42 38,38 38,12',
  c: '44,48 44,84 38,78 38,52',
  d: '8,86 42,86 36,80 14,80',
  e: '6,48 6,84 12,78 12,52',
  f: '6,6 6,42 12,38 12,12',
  g: '8,45 14,41 36,41 42,45 36,49 14,49',
}

export default function SevenSegment({ value }) {
  const ch = String(value)
  const on = DIGITS[ch] ?? ''
  return (
    <svg className="seven-seg" viewBox="0 0 50 90" width="38" height="68">
      {Object.entries(SEG).map(([k, pts]) => (
        <polygon
          key={k}
          points={pts}
          className={`seg ${on.includes(k) ? 'on' : 'off'}`}
        />
      ))}
    </svg>
  )
}
