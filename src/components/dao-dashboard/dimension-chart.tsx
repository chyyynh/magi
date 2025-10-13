"use client"

interface DimensionChartProps {
  data: {
    governance: { score: number }
    treasury: { score: number }
    decentralization: { score: number }
    community: { score: number }
    efficiency: { score: number }
    protocol: { score: number }
  }
}

export function DimensionChart({ data }: DimensionChartProps) {
  const dimensions = [
    { name: "Governance", short: "GOV", score: data.governance.score, angle: 0 },
    { name: "Treasury", short: "TRS", score: data.treasury.score, angle: 60 },
    { name: "Decentralization", short: "DEC", score: data.decentralization.score, angle: 120 },
    { name: "Community", short: "COM", score: data.community.score, angle: 180 },
    { name: "Efficiency", short: "EFF", score: data.efficiency.score, angle: 240 },
    { name: "Protocol", short: "PRO", score: data.protocol.score, angle: 300 },
  ]

  const size = 320
  const center = size / 2
  const maxRadius = size / 2 - 50

  const getPoint = (angle: number, distance: number) => {
    const radian = ((angle - 90) * Math.PI) / 180
    return {
      x: center + distance * Math.cos(radian),
      y: center + distance * Math.sin(radian),
    }
  }

  const points = dimensions
    .map((d) => {
      const point = getPoint(d.angle, (d.score / 100) * maxRadius)
      return `${point.x},${point.y}`
    })
    .join(" ")

  return (
    <svg width={size} height={size} className="mx-auto">
      <defs>
        <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="oklch(0.65 0.25 195)" stopOpacity="0" />
          <stop offset="50%" stopColor="oklch(0.65 0.25 195)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="oklch(0.65 0.25 195)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="dataGradient">
          <stop offset="0%" stopColor="oklch(0.65 0.25 195)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="oklch(0.65 0.25 195)" stopOpacity="0.1" />
        </radialGradient>
      </defs>

      {[20, 40, 60, 80, 100].map((percent) => (
        <circle
          key={percent}
          cx={center}
          cy={center}
          r={(percent / 100) * maxRadius}
          fill="none"
          stroke="oklch(0.18 0.02 240)"
          strokeWidth="1"
          opacity={percent === 100 ? 0.5 : 0.2}
        />
      ))}

      {dimensions.map((d) => {
        const point = getPoint(d.angle, maxRadius)
        return (
          <line
            key={d.name}
            x1={center}
            y1={center}
            x2={point.x}
            y2={point.y}
            stroke="oklch(0.18 0.02 240)"
            strokeWidth="1"
            opacity={0.3}
          />
        )
      })}

      <g className="animate-radar-sweep" style={{ transformOrigin: `${center}px ${center}px` }}>
        <line
          x1={center}
          y1={center}
          x2={center}
          y2={center - maxRadius}
          stroke="url(#radarGradient)"
          strokeWidth="2"
        />
      </g>

      <polygon points={points} fill="url(#dataGradient)" stroke="oklch(0.65 0.25 195)" strokeWidth="2" />

      {dimensions.map((d) => {
        const point = getPoint(d.angle, (d.score / 100) * maxRadius)
        return (
          <g key={d.name}>
            <circle cx={point.x} cy={point.y} r="6" fill="oklch(0.65 0.25 195)" opacity={0.3} />
            <circle
              cx={point.x}
              cy={point.y}
              r="3"
              fill="oklch(0.65 0.25 195)"
              style={{
                filter: "drop-shadow(0 0 4px oklch(0.65 0.25 195))",
              }}
            />
          </g>
        )
      })}

      {dimensions.map((d) => {
        const labelPoint = getPoint(d.angle, maxRadius + 30)
        return (
          <g key={d.name}>
            <text
              x={labelPoint.x}
              y={labelPoint.y - 8}
              textAnchor="middle"
              className="fill-foreground text-xs font-semibold"
            >
              {d.short}
            </text>
            <text x={labelPoint.x} y={labelPoint.y + 6} textAnchor="middle" className="fill-primary text-xs font-bold">
              {d.score}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
