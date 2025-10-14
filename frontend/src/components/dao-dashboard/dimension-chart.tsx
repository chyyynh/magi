"use client"

import { useState, useEffect, useRef } from "react"
import { animate, stagger } from "animejs"

interface DimensionChartProps {
  data: {
    governance: { score: number }
    treasury: { score: number }
    decentralization: { score: number }
    community: { score: number }
    efficiency: { score: number }
    protocol: { score: number }
  }
  onDimensionClick?: (dimension: string) => void
  selectedDimension?: string | null
}

export function DimensionChart({ data, onDimensionClick, selectedDimension }: DimensionChartProps) {
  const [hoveredDimension, setHoveredDimension] = useState<string | null>(null)
  const [animatedScores, setAnimatedScores] = useState<Record<string, number>>({})
  const svgRef = useRef<SVGSVGElement>(null)
  const polygonRef = useRef<SVGPolygonElement>(null)
  const circleGridRef = useRef<SVGGElement>(null)

  const dimensions = [
    { name: "Governance", short: "GOV", key: "governance", score: data.governance.score, angle: 0 },
    { name: "Treasury", short: "TRS", key: "treasury", score: data.treasury.score, angle: 60 },
    { name: "Decentralization", short: "DEC", key: "decentralization", score: data.decentralization.score, angle: 120 },
    { name: "Community", short: "COM", key: "community", score: data.community.score, angle: 180 },
    { name: "Efficiency", short: "EFF", key: "efficiency", score: data.efficiency.score, angle: 240 },
    { name: "Protocol", short: "PRO", key: "protocol", score: data.protocol.score, angle: 300 },
  ]

  const size = 320
  const center = size / 2
  const maxRadius = size / 2 - 50

  // Initialize animated scores on mount
  useEffect(() => {
    const initialScores: Record<string, number> = {}
    dimensions.forEach(d => {
      initialScores[d.key] = 0
    })
    setAnimatedScores(initialScores)

    // Animate grid circles entrance
    if (circleGridRef.current) {
      animate(circleGridRef.current.children, {
        scale: [0, 1],
        opacity: [0, 1],
        delay: stagger(100),
        duration: 800,
        easing: 'outElastic(1, .6)'
      })
    }

    // Animate scores from 0 to target values
    const scoreAnimations: Record<string, number> = {}
    dimensions.forEach(d => {
      scoreAnimations[d.key] = 0
    })

    animate(scoreAnimations, {
      ...dimensions.reduce((acc, d) => {
        acc[d.key] = d.score
        return acc
      }, {} as Record<string, number>),
      duration: 1500,
      delay: 500,
      easing: 'outCubic',
      onUpdate: () => {
        setAnimatedScores({ ...scoreAnimations })
      }
    })
  }, [])

  // Animate dimension selection
  useEffect(() => {
    if (selectedDimension) {
      const dimensionIndex = dimensions.findIndex(d => d.key === selectedDimension)
      if (dimensionIndex !== -1) {
        const element = document.querySelector(`[data-dimension="${selectedDimension}"]`)
        if (element) {
          animate(element, {
            scale: [1, 1.3, 1],
            duration: 600,
            easing: 'outElastic(1, .5)'
          })
        }
      }
    }
  }, [selectedDimension])

  const getPoint = (angle: number, distance: number) => {
    const radian = ((angle - 90) * Math.PI) / 180
    return {
      x: center + distance * Math.cos(radian),
      y: center + distance * Math.sin(radian),
    }
  }

  const points = dimensions
    .map((d) => {
      const score = animatedScores[d.key] ?? d.score
      const point = getPoint(d.angle, (score / 100) * maxRadius)
      return `${point.x},${point.y}`
    })
    .join(" ")

  return (
    <svg ref={svgRef} width={size} height={size} className="mx-auto">
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

      <g ref={circleGridRef}>
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
            style={{ transformOrigin: `${center}px ${center}px` }}
          />
        ))}
      </g>

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

      <polygon
        ref={polygonRef}
        points={points}
        fill="url(#dataGradient)"
        stroke="oklch(0.65 0.25 195)"
        strokeWidth="2"
      />

      {dimensions.map((d) => {
        const score = animatedScores[d.key] ?? d.score
        const point = getPoint(d.angle, (score / 100) * maxRadius)
        const isSelected = selectedDimension === d.key
        const isHovered = hoveredDimension === d.key
        const isActive = isSelected || isHovered

        return (
          <g
            key={d.name}
            data-dimension={d.key}
            style={{
              cursor: onDimensionClick ? 'pointer' : 'default',
              transformOrigin: `${point.x}px ${point.y}px`
            }}
            onMouseEnter={() => {
              setHoveredDimension(d.key)
              // Pulse animation on hover
              const element = document.querySelector(`[data-dimension="${d.key}"]`)
              if (element) {
                animate(element, {
                  scale: [1, 1.15, 1],
                  duration: 400,
                  easing: 'outQuad'
                })
              }
            }}
            onMouseLeave={() => setHoveredDimension(null)}
            onClick={() => onDimensionClick?.(d.key)}
          >
            <circle
              cx={point.x}
              cy={point.y}
              r={isActive ? "10" : "6"}
              fill="oklch(0.65 0.25 195)"
              opacity={isActive ? 0.5 : 0.3}
              style={{ transition: 'all 0.2s ease' }}
            />
            <circle
              cx={point.x}
              cy={point.y}
              r={isActive ? "5" : "3"}
              fill={isActive ? "oklch(0.7 0.28 195)" : "oklch(0.65 0.25 195)"}
              style={{
                filter: isActive
                  ? "drop-shadow(0 0 8px oklch(0.65 0.25 195))"
                  : "drop-shadow(0 0 4px oklch(0.65 0.25 195))",
                transition: 'all 0.2s ease'
              }}
            />
          </g>
        )
      })}

      {dimensions.map((d) => {
        const labelPoint = getPoint(d.angle, maxRadius + 30)
        const score = animatedScores[d.key] ?? d.score
        const isSelected = selectedDimension === d.key
        const isHovered = hoveredDimension === d.key
        const isActive = isSelected || isHovered

        return (
          <g
            key={d.name}
            data-label={d.key}
            style={{
              cursor: onDimensionClick ? 'pointer' : 'default',
              transformOrigin: `${labelPoint.x}px ${labelPoint.y}px`
            }}
            onMouseEnter={() => {
              setHoveredDimension(d.key)
              const element = document.querySelector(`[data-label="${d.key}"]`)
              if (element) {
                animate(element, {
                  scale: [1, 1.1, 1],
                  duration: 400,
                  easing: 'outQuad'
                })
              }
            }}
            onMouseLeave={() => setHoveredDimension(null)}
            onClick={() => onDimensionClick?.(d.key)}
          >
            <text
              x={labelPoint.x}
              y={labelPoint.y - 8}
              textAnchor="middle"
              className={`text-xs font-semibold ${isActive ? 'fill-primary' : 'fill-foreground'}`}
              style={{ transition: 'all 0.2s ease' }}
            >
              {d.short}
            </text>
            <text
              x={labelPoint.x}
              y={labelPoint.y + 6}
              textAnchor="middle"
              className="fill-primary text-xs font-bold"
              style={{
                fontSize: isActive ? '14px' : '12px',
                transition: 'all 0.2s ease'
              }}
            >
              {Math.round(score)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
