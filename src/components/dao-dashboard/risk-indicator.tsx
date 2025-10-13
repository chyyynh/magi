interface RiskIndicatorProps {
  label: string
  level: "low" | "moderate" | "high" | "critical"
  value: number
}

export function RiskIndicator({ label, level, value }: RiskIndicatorProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-success"
      case "moderate":
        return "bg-warning"
      case "high":
        return "bg-danger"
      case "critical":
        return "bg-destructive"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
        <span className="font-mono text-xs font-bold text-foreground">{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/20">
        <div
          className={`h-full transition-all duration-500 ${getLevelColor(level)}`}
          style={{
            width: `${value}%`,
            boxShadow: "0 0 8px currentColor",
          }}
        />
      </div>
    </div>
  )
}
