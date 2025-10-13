"use client"

interface TrendChartProps {
  data: { date: string; score: number }[]
}

export function TrendChart({ data }: TrendChartProps) {
  const width = 280
  const height = 120
  const padding = 20

  const maxScore = Math.max(...data.map((d) => d.score))
  const minScore = Math.min(...data.map((d) => d.score))
  const scoreRange = maxScore - minScore || 1

  const points = data
    .map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2)
      const y = height - padding - ((d.score - minScore) / scoreRange) * (height - padding * 2)
      return `${x},${y}`
    })
    .join(" ")

  const pathD = `M ${points.split(" ").join(" L ")}`

  return (
    <svg width={width} height={height} className="mx-auto">
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((percent) => {
        const y = height - padding - (percent / 100) * (height - padding * 2)
        return (
          <line
            key={percent}
            x1={padding}
            y1={y}
            x2={width - padding}
            y2={y}
            stroke="currentColor"
            strokeWidth="1"
            className="text-border"
            opacity={0.2}
          />
        )
      })}

      {/* Area under curve */}
      <path
        d={`${pathD} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`}
        fill="currentColor"
        className="text-primary"
        opacity={0.1}
      />

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-primary"
        style={{
          filter: "drop-shadow(0 0 4px currentColor)",
        }}
      />

      {/* Points */}
      {data.map((d, i) => {
        const x = padding + (i / (data.length - 1)) * (width - padding * 2)
        const y = height - padding - ((d.score - minScore) / scoreRange) * (height - padding * 2)
        return <circle key={i} cx={x} cy={y} r="3" fill="currentColor" className="text-primary" />
      })}
    </svg>
  )
}
