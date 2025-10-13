"use client"

import { useEffect, useState } from "react"

interface ScoreRingProps {
  score: number
  size?: number
}

export function ScoreRing({ score, size = 200 }: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedScore / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, 100)
    return () => clearTimeout(timer)
  }, [score])

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-success"
    if (score >= 50) return "text-warning"
    return "text-danger"
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg] transform">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${getScoreColor(score)} transition-all duration-1000 ease-out`}
          style={{
            filter: "drop-shadow(0 0 8px currentColor)",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`font-mono text-5xl font-bold ${getScoreColor(score)}`}>{Math.round(animatedScore)}</div>
        <div className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">Health Score</div>
      </div>
    </div>
  )
}
